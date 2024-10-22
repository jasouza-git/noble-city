import { Camera, Engine, Scene, sprite } from './engine';
import { LoadMenu } from '../component/loadmenu';
import { Map } from '../component/map';
import { UI } from '../component/ui';
import { economy } from './economy';
import { Items } from '../item/_';
import { map_data } from './map';

// Game and Camera
export let game = new Engine;
export let cam = new Camera('#game', game);
game.base = '/assets/';
cam.fit = true;
cam.scale(4);

// Game Map

// Debugging (Remove this on Production)
/*
cam.s = 2;//0.25;
cam.y = -120;
cam.x = 280;*/
for (const f of Items) economy.item.push(new f());

// First Scene : Loading Menu
let loadmenu = new LoadMenu();
let loading = new Scene(game, loadmenu);
game.load(p => {loadmenu.per = p; if (p == 1) mainscene.show()}, UI, Map);
loading.show();
loadmenu.start = ()=>{
    cam.full();
    mainscene.show();
};

// Second Scene : Main game
let map = new Map(game);
let ui = new UI();
let mainscene = new Scene(game, map, ui);
map.generate(map_data);
map.focused = build => {
    cam.play('sfx/whoosh.mp3', 0.25, 0.4);
    ui.title = build.name;
    ui.menu = 2;
    ui.focus = build;
};
export function popup(sprites:sprite[]):void {
    return ui.popup(sprites);
}
ui.menu = 1;
//ui.title = 'Inventory';

// Main loop
game.loop = (dt:number, t:number, cam:Camera) => {
    let inp = game.inp;

    // Update game logs
    economy.update();
    // If not focusing on map then no zooming/dragging
    if (ui.menu != 1) return;
    // Zooming effects
    if (inp.dsy) {
        let z = Math.max(0.25, Math.min(8, cam.sx*Math.pow(1.5, -inp.dsy/100)));
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
