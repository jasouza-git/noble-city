import { Camera, Engine, Scene, sprite } from './engine';
import { LoadMenu } from '../component/loadmenu';
import { Map } from '../component/map';
import { UI } from '../component/ui';
import { economy } from './economy';
import { Items } from '../item/_';
import { map_data } from './map';
import { Mentor } from '../people/mentor';
import { Iroiro } from '../people/iroiro';

// Game and Camera
export let game = new Engine;
export let cam = new Camera('#game', game);
game.base = '/assets/';
cam.fit = true;
cam.scale(4);
cam.s = 0.25;

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
game.load(p => {loadmenu.per = p/*; if (p == 1) mainscene.show()*/}, UI, Map, Iroiro, Mentor);
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
    if (ui.focus != null) return;
    build.focused = true;
    cam.play('sfx/whoosh.mp3', 1, 0.4);
    ui.title = build.name;
    ui.menu = 2;
    ui.focus = build;
};
export function popup(sprites:sprite[]):void {
    return ui.popup(sprites);
}

let iroiro = new Iroiro();
let mentor = new Mentor();
ui.chats = [
    [iroiro, 'Oh newbie investor! We are in dire need of help!', 1],
    [iroiro, 'Our funds for the Dinagyang Festival have come short! If\nwe don\'t gather enough funds, the celebration won\'t be\nas vibrant as it should be.', 1],
    [iroiro, 'The performers and everyone who\'s been preparing for\nmonths are relying on this!', 1],
    [mentor, 'Funds, I hear? It seems like you\'ve stepped into the\nworld of business at an interesting time', 0],
    [mentor, 'Sponsoring the Dinagyang Festival can bring you a lot of\ngoodwill, but it\'s also a big responsibility. I suggest\nyou think strategically about how to allocate your funds', 1],
    [iroiro, 'Ah! Where did you come from?!', 4],
    [mentor, 'But do not fear newbie, I shall guide you in your journey\nfor FREE!', 6],
];

let target = 1000000;
//economy.money = target;
//economy.time = 1;
economy.end = () => {
    cam.x = 0;
    cam.y = 0;
    cam.s = 0.25;
    ui.chats = economy.points < 0 ? [
        // User got backrupted
        [mentor, `Hello once again, sad to say that your bankrupted by\n${Math.abs(economy.points)} pesos!`, 10],
        [mentor, 'Thats okay, this is a learning experience and hopefully\nyou would be able to learn more', 3],
        [iroiro, 'Thanks for trying', 1],
    ] : economy.points < target ? [
        // User passed but did not get beyond target
        [mentor, `Congraduations on your bussiness! You have a\nnet total of ${Math.abs(economy.points)} pesos!`, 1],
        [iroiro, 'Although we didnt reach out target, thanks for trying', 0],
    ]: [
        // User passed target
        [mentor, `Wow! You were able to meet the target goal!\nYou have a net total of ${Math.abs(economy.points)} pesos!`, 4],
        [iroiro, 'Im so happy! Thank you for saving Dinagyan!', 2],
    ];
};

// Debug
/*ui.menu = 1;
ui.chats = [];*/

// Main loop
game.loop = (dt:number, t:number, cam:Camera) => {
    let inp = game.inp;

    // Update game logs
    economy.update();
    // If not focusing on map then no zooming/dragging
    if (ui.menu != 1 || ui.chats.length) return;
    // Zooming effects
    if (inp.dsy) {
        let z = Math.max(0.16, Math.min(8, cam.sx*Math.pow(1.5, -inp.dsy/100)));
        //cam.x = (inp.rx*z/cam.sx+cam.w/2-inp.x)/z;
        //cam.y = (inp.ry*z/cam.sy+cam.h/2-inp.y)/z;
        cam.s = z;
    }
    // Dragging effects
    inp.cb(1) && inp.dx && inp.dy; // Reset delta
    if (inp.b&1) {
        cam.x -= inp.dx/cam.sx;
        cam.y -= inp.dy/cam.sy;
        let rx = 10000*Math.min(1,cam.sx);
        let ry = 5000*Math.min(1,cam.sy);
        cam.x = Math.min(rx, Math.max(-rx, cam.x));
        cam.y = Math.min(ry, Math.max(-ry, cam.y));
    }
};
