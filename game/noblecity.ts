import { sprite, Camera, Entity, Input, Engine } from '../engine';
import { LoadMenu } from '../entity/loadmenu';
import { UI } from '../entity/ui';
import { Map, map_obj } from '../entity/map';

// Game and Camera
let game = new Engine;
game.base = '/assets/';
let cam = new Camera('#game', game);
cam.fit = true; // Make it fullscreen

// Game Map
let map_data:map_obj[] = [
    {type:'sand', x:-2, y:-2, w:4, h:4},
    {type:'grass', x:-2, y:-2, w:4, h:4},
    {type:'sand', x:2, y:1, w:2, h: 2},
    {type:'grass', x:2, y:1, w:2, h: 2},
    {type:'sand', x:-1, y:1, h:3},
    {type:'grass', x:-1, y:2, w:1, h:3},
    {type:'grass', x:1, y:1},
    {type:'dirt', x:-1, y:-1, v:true, w:4},
    {type:'dirt', x:-2, y:1, w:4},
    {type:'fishing', x:0, y:0},
];

// First Scene : Loading Menu
let loading = new LoadMenu();
game.scenes.push([loading]);

// Second Scene : Main game
let map = new Map();
map.generate(map_data);
let ui = new UI();
game.scenes.push([map, ui]);

// Load assets
game.load((a,b) => {
    loading.per = a/b;
    if (a/b == 1) game.scene = 1;
}, UI, Map);

// Main loop
game.loop = (dt:number, t:number, cam:Camera) => {
    if (ui.menu == 0) return;
    let inp = game.inp;

    // Zooming effects
    if (inp.dsy) {
        let z = Math.max(0.125, Math.min(8, cam.sx*Math.pow(2, -inp.dsy/100)));
        cam.x = (inp.rx*z/cam.sx+cam.w/2-inp.x)/z;
        cam.y = (inp.ry*z/cam.sy+cam.h/2-inp.y)/z;
        cam.s = z;
    }
    // Reset dragging delta
    if (inp.cb(1)) {
        inp.dx = 0;
        inp.dy = 0;
    }
    // Dragging effects
    if (inp.b&1) {
        cam.x -= inp.dx/cam.sx;
        cam.y -= inp.dy/cam.sy;
        cam.x = Math.min(200, Math.max(-200, cam.x));
        cam.y = Math.min(200, Math.max(-200, cam.y));
    }

    // Move map
    /*if ('a' in inp.dkey || 's' in inp.dkey || 'd' in inp.dkey || 'w' in inp.dkey) {
        if (inp.dkey['a'] == 0) this.mapdat[4].x--;
        if (inp.dkey['d'] == 0) this.mapdat[4].x++;
        if (inp.dkey['w'] == 0) this.mapdat[4].y--;
        if (inp.dkey['s'] == 0) this.mapdat[4].y++;
        if (inp.dkey['a'] == 2) { this.mapdat[4].x--; this.mapdat[4].w = (this.mapdat[4].w||0)+1; }
        this.map.generate(this.mapdat);
    }*/
};
