import { sprite, Camera, Entity, Engine } from '../engine';

export class UI extends Entity {
    static res = [
        'coins.png',
        'ui/title.png',
        'ui/resume.png',
        'ui/options.png',
        'ui/exit.png',
        'ui/close.png',
        'ui/menu.png',
        'font/emulogic.ttf',
        'music/bgm1_prototype.wav',
    ];
    money:number = 1000;
    /**
     * Menu
     * 
     * 0) Main Menu
     * 1) Map interface
     */
    menu:number = 0;
    m:number = 0; // Menu delay
    render(dt:number, t:number, cam:Camera):sprite[] {
        if (this.eng == null) return [];
        this.m += (this.menu-this.m)*dt*10;
        let v = (...n:number[]) => n.map(x=>Math.max(0, 1-Math.abs(this.m-x))).reduce((a,b)=>a+b,0);
        let coin_num = Math.floor(t/200)%4;
        return [ {c:0, hover: s=>{ if(s.click) s.cur = 'pointer'; }},
            // Background music
            { aud:'music/bgm1_prototype.wav' },
            // Backdrop
            { f:'black', p:[[0,0],[],[cam.w,cam.h]], a:0.25*v(0,2) },
            // Title Card
            { x:cam.w*0.5, y:cam.h*0.25*(2*v(0)-1), f:UI.res[1], s:0.35 },
            // Coin
            {   f:UI.res[0],
                x:(cam.w*0.72+25)*v(0)+50*v(1)-25,
                y:(cam.h*0.2+25)*v(0)+50*v(1)-25,
                crop:[Math.abs(2-coin_num)*22,0,22,23],
                s:1.5,
                sx:coin_num==1?-1.5:1.5,
            },
            {
                t: String(this.money),
                tz: 20,
                tf: 'font/emulogic.ttf',
                x: 44,
                y: 38*v(1)-10,
                o: 'w',
                f: 'gold',
                b: 'black',
            },
            // FPS
            { t:String(this.eng.fps), o:'nw', tz:8 },
            
            // Menu
            {
                f: UI.res[2],
                x: cam.w/2,
                y: cam.h-200*v(0)+50,
                s: 0.5,
                p: [[-73,-25],[],[155,48], []],
                click: s => this.menu = 1,
            }, 
            {
                f: UI.res[3],
                x: cam.w/2,
                y: cam.h-200*v(0)+105,
                s: 0.5,
            },
            {
                f: UI.res[4],
                x: cam.w/2,
                y: cam.h-200*v(0)+160,
                s: 0.5,
                p: [[-73,-25],[],[155,48], []],
                click: s => {
                    cam.tile({f:'black'});
                    cam.scene = null;
                    s.cur = 'default';
                },
            },
            // Menu button
            {
                f: 'ui/menu.png',
                o: 'ne',
                x: cam.w+(30-40*v(1)),
                y: 10,
                s: 0.25,
                p: [[-30,0],[],[30,30],[]],
                click: s => this.menu = 0,
            },
            // Close button
            {
                f: 'ui/close.png',
                o: 'ne',
                x: cam.w+(70-40*(2-Math.abs(2-this.m))),
                y: 10,
                s: 0.25,
                p: [[-30,0],[],[30,30],[]],
                click: s => this.menu = 1,
            },
        ];
    }
}