import { sprite, Camera, Entity, Engine } from '../engine';

export class UI extends Entity {
    static res = [
        'coins.png',
        'ui/title.png',
        'ui/resume.png',
        'ui/options.png',
        'ui/exit.png',
        'ui/menu.png',
    ];
    money:number = 0;
    /**
     * Menu
     * 
     * 0) Main Menu
     * 1) Map interface
     */
    menu:number = 1;
    m:number = 1; // Menu delay
    render(dt:number, t:number, game:Engine, cam:Camera):sprite[] {
        if (dt<1) this.m += (this.menu-this.m)*dt*10;
        return [ {c:0},
            { // Backdrop
                f: 'black',
                p: [[0,0],[],[cam.w, cam.h]],
                a: 0.25*Math.abs(1-this.m),
            },
            // Title Card
            {
                x: cam.w*0.5,
                y: cam.h*(0.5-this.m)/2,
                f: UI.res[1],
                s: 0.35,
            },
            // Coin
            {
                f: UI.res[0],
                x: cam.w*0.72*(1-this.m)+this.m*25,
                y: cam.h*0.2*(1-this.m)+this.m*25,
                crop: [Math.abs(2-Math.floor(t/200)%4)*22,0,22,23],
                s: 1.5,
                sx: Math.floor(t/200)%4 == 1 ? -1.5 : 1.5,
            },
            { // FPS
                t: String(game.fps),
                o: 'nw',
                tz: 8,
            },
            
            // Menu
            {
                f: UI.res[2],
                x: cam.w/2,
                y: cam.h-150+this.m*200,
                s: 0.5,
                p: [[-73,-25],[],[155,48], []],
                hover: s => s.cur = 'pointer',
                click: s => this.menu = 1,
            }, 
            {
                f: UI.res[3],
                x: cam.w/2,
                y: cam.h-95+this.m*200,
                s: 0.5,
            },
            {
                f: UI.res[4],
                x: cam.w/2,
                y: cam.h-40+this.m*200,
                s: 0.5,
            },
            // Menu button
            {
                f: 'ui/menu.png',
                o: 'ne',
                x: cam.w+(30-40*this.m),
                y: 10,
                s: 0.25,
                p: [[-30,0],[],[30,30],[]],
                hover: s => s.cur = 'pointer',
                click: s => this.menu = 0,
            },
        ];
    }
}