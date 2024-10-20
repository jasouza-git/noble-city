import { sprite, Camera, Entity } from '../engine';
import { Building } from './building';

export class UI extends Entity {
    static res = [
        'coins.png',
        'ui/title.png',
        'ui/resume.png',
        'ui/options.png',
        'ui/exit.png',
        'ui/close.png',
        'ui/menu.png',
        'ui/bag.png',
        'font/emulogic.ttf',
        'music/bgm1_prototype.wav',
        'sfx/button.mp3',
        'sfx/whoosh.mp3',
        'ui/button_up.png', 'ui/button_down.png',
    ];
    box(s:sprite, cam:Camera, w:number=1, h:number=1, nobut:boolean=false):sprite[] {
        let r:sprite[] = []
        // Text
        if ('t' in s) {
            r.push({
                t: s.t,
                tz: 20,
                tf: 'font/emulogic.ttf',
                b: 'black',
                bz: 4,
                x: s.x??0,
                y: (s.y??0)+3,
                f: s.f??'white',
            });
            delete s.t;
            delete s.f;
        }
        // Image
        if ('f' in s) {
            r.push({
                f: s.f,
                x: (s.x??0)+(s.data?.x??0),
                y: (s.y??0)+(s.data?.y??0),
                s: 0.25,
                o: s.o??'',
            });
            delete s.f;
        }
        // Click Action
        let p = s.click;
        if ('click' in s) delete s.click;
        s.click = s => {
            if (s.data && s.data?.button) cam.play('sfx/button.mp3', 0.25);
            if (p) p(s);
        };
        return [{
            f: 'ui/button_up.png',
            s: 0.25,
            crop: [60,59,60,59,57,56,w,h],
            press: s => {
                if (s.data && s.data.button) s.f = 'ui/button_down.png';
            },
            ...s,
            data: {
                ...(s.data??{}),
                button: !nobut,
            },
        }, ...r];
    }
    /*private _p_focus:(number|undefined)[] = [0,0];
    focus(x?:number, y?:number):void {
        this._p_focus = [x,y];
    }*/
    money:number = 1000;
    /**
     * Menu
     * 
     * 0) Main Menu
     * 1) Map interface
     * 2) Inventory
     */
    menu:number = 0;
    private m:number = 0; // Menu transition
    focus:Entity|null = null; // Entity focused on
    title:string = 'Inventory'; // Inventory title
    render(dt:number, t:number, cam:Camera):sprite[] {
        if (this.eng == null) return [];
        this.m += (this.menu-this.m)*dt*10;
        let v = (...n:number[]) => n.map(x=>Math.max(0, 1-Math.abs(this.m-x))).reduce((a,b)=>a+b,0);
        let coin_num = Math.floor(t/200)%4;
        let box = (s:sprite,w:number=1,h:number=1,b:boolean=false) => this.box(s, cam, w, h, b);
        this.eng?.debug.mp(dt);
        // Stop focusing on entity
        if (this.menu != 2 && this.focus != null && Math.abs(this.m-2) > 0.99)
            this.focus = null;
        // Render ui
        return [ {c:0, hover: s=>{ if(s.click) s.cur = 'pointer'; }},
            // Background music
            { f:'music/bgm1_prototype.wav' },
            // Backdrop
            { f:'black', p:[[0,0],[],[cam.w,cam.h]], a:0.5*v(0,2) },
            // Focused entity
            ...(this.focus == null ? [] : cam.merge(...this.focus.render(dt, t, cam))),
            // Title Card
            { x:cam.w*0.5, y:cam.h*0.25*(2*v(0)-1), f:UI.res[1], s:0.35 },
            // Coin
            {   f:'coins.png',
                x:(cam.w*0.72+25)*v(0)-50*v(0)+25,
                y:(cam.h*0.2+25)*v(0)-50*v(0)+25,
                crop:[Math.abs(2-coin_num)*22,0,22,23],
                sx:coin_num==1?-1.5:1.5,
                sy:1.5,
            },
            {   t: String(this.money),
                tz: 20,
                tf: 'font/emulogic.ttf',
                x: 44,
                y: 28-38*v(0),
                o: 'w',
                f: 'gold',
                b: 'black',
                bz: 4,
            },
            // FPS
            { t:String(this.eng.fps), o:'nw', tz:8 },
            // Menu
            ...box({x:cam.w/2, y:cam.h-200*v(0)+50, t:'resume', f:'#4CAF50', click: s=>this.menu=1}, 10, 2),
            ...box({x:cam.w/2, y:cam.h-200*v(0)+105, t:'options', f:'#2196F3'}, 10, 2),
            ...box({x:cam.w/2, y:cam.h-200*v(0)+160, t:'exit', f:'#F44336'}, 10, 2),
            // Menu button
            ...box({x:cam.w+30-40*v(1), y:10, o:'ne', f:'ui/menu.png', click: s=>this.menu=0, data:{x:-3,y:9}}),
            ...box({x:cam.w+30-80*v(1), y:10, o:'ne', f:'ui/bag.png',  click: s=>{
                this.title = 'Inventory';
                this.menu = 2;
            }, data:{x:-7,y:7}}),
            ...box({x:cam.w+70-80*v(2), y:10, o:'ne', f:'ui/close.png', click: s=> {
                this.eng?.act('building_off');
                this.menu = 1;
            }, data:{x:-4,y:6}}),
            // Inventory or Building information
            ...(this.focus == null || this.title.toLowerCase() == 'inventory' ? [
                // Inventories
                ...box({x:cam.w/2, y:cam.h+150-(cam.h/2+135)*v(2)}, 40, 19, true),
            ] : [
                // Side Description
                ...box({x:cam.w+150-(cam.w/2+5)*v(2), y:cam.h/2+15}, 20, 19, true),
                // Ownership
                ...(this.focus instanceof Building ? box({x:cam.w/4, y:cam.h+25-(cam.h/8+25)*v(2), ...([
                    {t:'Cant Own', f:'#F44336'},
                    {t:'Purchase', f:'#4CAF50'},
                    {t:'Sell', f:'#2196F3'},
                ][this.focus.own] ??  {t:'Unknown', f:'#F44336'})}, 15, 2) : []),
            ]),
            // Title
            {   t: this.title,
                tz: 20,
                tf: 'font/emulogic.ttf',
                b: 'black',
                bz: 4,
                x: cam.w/2,
                y: 28*v(2)-10*(1-v(2)),
                f:'skyblue'
            },
        ];
    }
}