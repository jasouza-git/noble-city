import { Camera, Engine, Entity, Scene, sprite } from '../engine';
import { LoadMenu } from '../entity/loadmenu';
import { UI } from '../entity/ui';
import { Map, map_obj, Building } from '../entity/map';

// Game and Camera
let game = new Engine;
game.base = '/assets/';
let cam = new Camera('#game', game);
cam.fit = true; // Make it fullscreen
// Debugging
/*
cam.s = 2;//0.25;
cam.y = -120;
cam.x = 280;*/

// Game Map
let map_data:map_obj[] = [
    {type:'sand', x:-10, y:-10, w:20, h:20},
    {type:'grass',x:-9, y:-9, w:18, h:18},
    {type:'fishing', x:7, y:9},
    {type:'dirt',x:3,y:-8,w:16,v:true},
    {type:'cement',x:-8,y:1,w:16},
    {type:'bank',x:2,y:0},
    {type:'tree',x:1.6,y:0},
    {type:'callereal', x:0, y:0},
    {type:'farm',x:-2,y:-0.5},
    {type:'factory',x:-5,y:0},
    {type:'blank',x:5,y:0,color:['blue','brown','violet']},
    {type:'blank',x:4,y:0,color:['red','yellow','green']},
];
for (let y = 0; y < 10; y++)
    for (let x = 0; x < 10; x++)
        map_data.push({type:'tree',x:-8+x*0.5+(Math.random()-0.5),y:-8+y*0.5+(Math.random()-0.5)});

// First Scene : Loading Menu
let loadmenu = new LoadMenu();
let loading = new Scene(game, loadmenu);
loading.show(cam);

// Second Scene : Main game
let map = new Map(game);
let ui = new UI();
let mainscene = new Scene(game, map, ui);
map.generate(map_data);
ui.menu = 1;

// Actions
game.act = (act,...x) => {
    // A building was clicked
    if (act == 'building') {
        if (ui.menu == 1) setTimeout(() => {
            // Unintended click avoiding
            if (ui.menu != 1) return;
            // Error: Invalid argument
            if (!x.length || !(x[0] instanceof Building)) return;
            // Setup
            cam.play('sfx/whoosh.mp3');
            let e:Building = x[0];
            e.focused = true;
            ui.title = e.name;
            ui.menu = 2;
            ui.focus = e;
        }, 0);
    // User exits building
    } else if (act == 'building_off') {
        if (ui.focus instanceof Building) ui.focus.focused = false;
    // Entity wants to know if we are focusing on map
    } else if (act == 'onmap?') return ui.menu == 1;
}

// Load assets
game.load(p => {
    loadmenu.per = p;
    if (p == 1) mainscene.show();
}, UI, Map);

// Main loop
game.loop = (dt:number, t:number, cam:Camera) => {
    if (ui.menu == 0) return;
    let inp = game.inp;

    // If not focusing on map then no zooming/dragging
    if (ui.menu != 1) return;
    // Zooming effects
    if (inp.dsy) {
        let z = Math.max(0.25, Math.min(8, cam.sx*Math.pow(2, -inp.dsy/100)));
        //cam.x = (inp.rx*z/cam.sx+cam.w/2-inp.x)/z;
        //cam.y = (inp.ry*z/cam.sy+cam.h/2-inp.y)/z;
        cam.s = z;
    }
    // Dragging effects
    inp.cb(1) && inp.dx && inp.dy; // Reset delta
    if (inp.b&1) {
        cam.x -= inp.dx/cam.sx;
        cam.y -= inp.dy/cam.sy;
        let rx = 1300*Math.min(1,cam.sx);
        let ry = 600*Math.min(1,cam.sy);
        cam.x = Math.min(rx, Math.max(-rx, cam.x));
        cam.y = Math.min(ry, Math.max(-ry, cam.y));
    }
};
