import { sprite, Camera, Entity, merge } from '../src/engine';
import { Building } from '../building';
import { economy } from '../src/economy';
import { Items } from '../item/_';
import { People } from '../people/_';
import { Person } from '../people';

/**
 * Returns the sprites nessary to render a box
 * @param s Additional sprite to render box
 * @param cam Camera
 * @param w Width of box
 * @param h Height of box
 * @param mode Mode of box
 * - `0` - Button
 * - `1` - Up
 * - `2` - Down
 * - `3` - Disabled
 */
export function box(s:sprite, cam:Camera, w:number=1, h:number=1, mode:number=0):sprite[] {
    let r:sprite[] = []
    // Text
    if ('t' in s) {
        r.push({
            t: s.t,
            tz: s.tz??20,
            b: 'black',
            bz: s.bz??4,
            x: s.x??0,
            y: (s.y??0)+3,
            f: s.f??'white',
        });
        delete s.t;
        delete s.tz;
        delete s.f;
        delete s.bz;
    }
    // Image
    if ('f' in s) {
        r.push({
            f: s.f,
            x: (s.x??0)+(s.data?.x??0),
            y: (s.y??0)+(s.data?.y??0),
            s: 0.25,
            o: s.o??'',
            r: s.r??0,
            a: (mode&3)==3?0.5:1,
        });
        delete s.f;
        delete s.r;
    }
    // Click Action
    let p = s.click;
    if ('click' in s) delete s.click;
    s.click = s => {
        if (s.data && s.data.disabled) return;
        if (s.data?.button) cam.play('sfx/button.mp3', 0.25);
        if (p) p(s);
    };
    return [{
        f: (mode&3) == 3 ? 'ui/button_disabled.png' : (mode&3) == 2 ? 'ui/button_down.png' : 'ui/button_up.png',
        s: 0.25,
        crop: (mode&4) == 4 ? [49,48,49,48,46,45,w,h,11,11] : [60,59,60,59,57,56,w,h],
        press: s => {
            if (s.data && s.data.button) s.f = 'ui/button_down.png';
        },
        ...s,
        data: {
            ...(s.data??{}),
            button: (mode&3) == 0,
            disabled: (mode&3) == 3,
        },
    }, ...r];
}
export function v2(...n:number[]):number {
    return n.map(x=>Math.max(0, 1-Math.abs(this.m-x))).reduce((a,b)=>a+b,0);
}
/**
 * User Interface of the Game
 */
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
        'ui/next.png',
        'font/emulogic.ttf',
        'music/bgm1_prototype.wav', 'music/topic_exudo.mp3',
        'sfx/button.mp3',
        'sfx/whoosh.mp3', 'sfx/zoomout.mp3',
        'ui/button_up.png', 'ui/button_down.png', 'ui/button_disabled.png',
        'plan.png',
        'ui/arrow.png', 'ui/arrow_off.png',
        'sfx/cash-register-sfx.mp3',
        'sfx/Pause.mp3', 'sfx/Time-Forward.mp3', 'sfx/Unpause_Play.mp3',
        'sfx/selling_sfx_1.mp3', 'sfx/selling_sfx_2.mp3', 'sfx/selling_sfx_3.mp3',
        'sfx/typing.wav',
    ];
    static depend = [...Items, ...People];
    /**
     * Top popup
     */
    pop:sprite[] = [];
    private pop_c = 0;
    pop_t = 0;
    help = 0;
    private help_c = 0;
    private gameover_c = 0;
    /**
     * Chat box
     */
    chats:[Person,string,number][] = [];
    /**
     * The close button was clicked
     */
    closed:()=>void = ()=>{};
    /**
     * Shows a popup sprite
     */
    popup(sprites:sprite[]):void {
        this.pop = sprites;
        this.pop_t = 0;
    }
    focused:(build:Building)=>void = ()=>{};
    /**
     * Tutorial Stage
     * 0. Not in tutorial
     * 1.
     */
    tutorial = 1;
    /**
     * Menu
     * 
     * 0) Main Menu
     * 1) Map interface
     * 2) Inventory
     */
    menu:number = 0;
    private m:number = 0; // Menu transition
    focus:Building|null = null; // Entity focused on
    title:string = 'Inventory'; // Inventory title
    sprites:sprite[] = [];
    chattext:number = 0;
    fade:number = -1;
    new = true;
    render(dt:number, t:number, cam:Camera):sprite[] {
        if (this.eng == null) return [];
        // POPUP
        this.pop_c += ((this.pop.length?1:0)-this.pop_c)*dt*10;
        if (this.pop.length && this.pop_t == 0) {
            this.pop_t = performance.now();
            for (const s of this.pop) s.c = s.c??0;
        }
        if (this.pop.length && performance.now()-this.pop_t > 3000) this.pop = [];
        // Help
        this.help_c += (this.help-this.help_c)*dt*10;
        if (this.eng.inp.dkey['q'] == 0) this.help = 1-this.help;
        // Menu
        this.m += (this.menu-this.m)*dt*10;
        // Stop focusing on entity
        if (this.menu != 2 && this.focus != null && Math.abs(this.m-2) > 0.99) {
            this.focus = null;
        }
        // Stop chatbox
        //if (this.chat && !this.chat.msg.length) this.chat = null;
        // Chatbox text
        if (this.chats.length) this.chattext = Math.min(this.chats[0][1].length, this.chattext+dt*50);
        // Shortcuts
        let v = (...n:number[]) => n.map(x=>Math.max(0, 1-Math.abs(this.m-x))).reduce((a,b)=>a+b,0);
        let coin_num = Math.floor(t/200)%4;
        let b = (s:sprite,w:number=1,h=1,m=0) => box(s, cam, w, h, m);
        // Fade (1s)
        if (this.fade != -1) {
            if (this.fade < 0.5 && this.fade+dt >= 0.5) economy.next();
            this.fade += dt;
            if (this.fade >= 1) this.fade = -1;
        }
        if (economy.time == 0 && !this.chats.length) this.gameover_c += (1-this.gameover_c)*dt*10;
        // Render ui
        return [ {c:0, hover: s=>{ if(s.click) s.cur = 'pointer' }, tf:'font/emulogic.ttf'},
            // Background music
            { f:'music/topic_exudo.mp3', a:0.125 },
            // Backdrop (click is used to prevent clicks from passing through if its visible)
            { f:'black', p:[[0,0],[],[cam.w,cam.h]], a:0.5*(1-v(1)), click:this.menu==1?undefined:()=>{} },
            // Focused entity
            ...(this.focus == null ? [] : merge(this.focus.render(dt, t, cam))),
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
            {   t: String(economy.money),
                tz: 20,
                x: 44,
                y: 28-38*v(0),
                o: 'w',
                f: 'gold',
                b: 'black',
                bz: 4,
            },
            // Day
            {   t: `${economy.time} months left`,
                tz: 15,
                x: cam.w-130,
                y: 28-38*(1-v(1)),
                o: 'e',
                f: 'white',
                b: 'black',
                bz: 5,
            },
            // FPS
            { t:String(this.eng.fps), o:'nw', tz:8 },
            // Menu
            ...b({x:cam.w/2, y:cam.h-200*v(0)+50, t:this.new?'play':'resume', f:'#4CAF50', click: s=>{
                this.menu=1;
                this.chattext = 0;
                this.new = false;
                cam.play('sfx/Pause.mp3');
            }}, 10, 2),
            ...b({x:cam.w/2, y:cam.h-200*v(0)+105, t:'options', f:'#2196F3'}, 10, 2),
            ...b({x:cam.w/2, y:cam.h-200*v(0)+160, t:'exit', f:'#F44336'}, 10, 2),
            // Menu button
            ...b({x:cam.w+30-40*v(1), y:10, o:'ne', f:'ui/menu.png', click: s=>{
                this.menu=0;
                cam.play('sfx/Unpause_Play.mp3');
            }, data:{x:-3,y:9}}),
            ...b({x:cam.w+30-80*v(1), y:10, o:'ne', f:'ui/bag.png',  click: s=>{
                this.title = 'Inventory';
                this.menu = 3;
            }, data:{x:-7,y:7}}),
            ...b({x:cam.w+30-120*v(1), y:10, o:'ne', f:'ui/next.png', click: s => {
                if (economy.time == 0) return;
                this.fade = 0;
                cam.play('sfx/Time-Forward.mp3', 1, 2);
            }, data:{x:-10,y:9}}),
            ...b({x:cam.w+70-80*v(2,3), y:10, o:'ne', f:'ui/close.png', click: s=> {
                this.closed();
                if (this.focus) {
                    this.focus.focused = false;
                    cam.play('sfx/zoomout.mp3', 1, 0.4);
                }
                this.menu = 1;
            }, data:{x:-4,y:6}}),
            // Inventory
            ...(this.menu == 3 ? [
                // Inventories
                ...b({x:cam.w/2, y:cam.h+150-(cam.h/2+135)*v(3)}, 40, 20, 1),
                // Boxes
                ...Array(32).fill(0).map((_,n):sprite=>{
                    let x = n%8;
                    let y = Math.floor(n/8);
                    return {
                        c: 0,
                        f: 'ui/button_down.png',
                        s: 0.25,
                        crop: [60,59,60,59,57,56,3,3],
                        x: 75+70*x,
                        y: 90+70*y+(cam.h-50)*(1-v(3)),
                    }
                }),
                // Buildings
                ...economy.own.map((b,n) => {
                    let x = n%8;
                    let y = Math.floor(n/8);
                    return [...merge(b.render(dt, t, cam)).map(s => {
                        s.c = 0;
                        s.x = 75+70*x;
                        s.y = 100+70*y+(cam.h-50)*(1-v(3));
                        s.s = 0.25;
                        s.click = undefined;
                        return s;
                    }), {
                        c: 0,
                        x: 75+70*x,
                        y: 90+70*y+(cam.h-50)*(1-v(3)),
                        p: [[-28, -28],[],[58, 57],[]],
                        click: s => {
                            cam.x = b.x;
                            cam.y = b.y;
                            this.menu = 1;
                        },
                    }];
                }).flat(),
                // Items
                ...economy.item.map((i,n) => {
                    let x = (n+economy.own.length)%8;
                    let y = Math.floor((n+economy.own.length)/8);
                    return [
                        ...merge(i.render(dt, t, cam)).map(s => {
                            s.x = 75+70*x;
                            s.y = 100+70*y+(cam.h-50)*(1-v(3));
                            return s;
                        }),
                        i.num(75+70*x,110+70*y+(cam.h-50)*(1-v(3))),
                    ];
                }).flat(),
                // Title
                {
                    t: this.title,
                    tz: 20,
                    b: 'black',
                    bz: 4,
                    x: cam.w/2,
                    y: 28*v(3)-10*(1-v(3)),
                    f:'skyblue'
                },
            ] : []),
            // Building information
            ...(this.focus != null ? [
                // Side Description
                ...b({x:cam.w+150-(cam.w/2+5)*v(2), y:cam.h/2+15}, 20, 19, 1),
                // Ownership
                ...b({x:cam.w/4, y:cam.h+25-(cam.h/8+25)*v(2), ...([
                    {t:'Cant Own', f:'#F44336' },
                    {t:'Purchase', f:'#4CAF50', click: s=>{
                        if (this.focus instanceof Building) economy.building(this.focus, true);
                    }},
                    {t:'Sell', f:'#2196F3', click: s=>{
                        if (this.focus instanceof Building) economy.building(this.focus, false);
                    }},
                ][this.focus.own] ??  {t:'Unknown', f:'#F44336'})}, 15, 2, this.focus.own == 0 ? 3 : 0),
                // Price
                ...(this.focus.price ? [{
                    t: `₱${this.focus.price}`,
                    x: cam.w/4,
                    y: cam.h+25-(cam.h/4+15)*v(2),
                    f: 'white',
                    a: 0.75,
                }]: []),
                // Custom building ui
                ...this.focus.menu(dt, t, cam, v(2)).map(s => {
                    s.c = s.c??0;
                    // cam.w+150-(cam.w/2+5)*ui.v(2), cam.h/2+15, 41*57, 20*56
                    s.x = (s.x??0)+cam.w+150-(cam.w/2+5)*v(2);
                    s.y = (s.y??0)+cam.h/2+15;
                    return s;
                }),
                // Title
                {
                    t: this.title,
                    tz:  15,
                    b: 'black',
                    bz: 4,
                    x: cam.w/4,
                    y: 70*v(2)-10*(1-v(2)),
                    f:'skyblue'
                },
            ] : []),
            // Chatbox
            ...(this.chats.length && this.menu == 1 ? [
                // Chating sfx
                { f:'sfx/typing.wav', a:this.chattext==this.chats[0][1].length?0:1 },
                // Backdrop
                { f:'black', a:0.5, p:[[0,0],[],[cam.w,cam.h],[]], click:()=>{} },
                // Person
                ...merge(this.chats[0][0].render(dt, t, cam, this.chats[0][2])).map(s=> {
                    s.x = (s.x??0)+13*cam.w/16;
                    s.y = (s.y??0)+9*cam.h/16+500*(1-v(1));
                    return s;
                }),
                // Box
                ...b({x:cam.w/2, y:cam.h-45+500*(1-v(1)), click: s => {
                    this.chats.shift();
                    if (this.chats.length) cam.play('sfx/retro-text-dialouge-typing-sfx.wav');
                    this.chattext = 0;
                }}, 40, 6),
                // Name
                { t:this.chats[0][0].name, x:35, y:cam.h-85+500*(1-v(1)), o:'nw' } as sprite,
                // Message
                ...this.chats[0][1].slice(0,Math.round(this.chattext)).split('\n').map((l,n) => {
                    return { t:l, x:35, y:cam.h-55+500*(1-v(1))+20*n, o:'nw', tz:10, a:0.75 } as sprite;
                }),
                // Skip
                ...b({x:64, y:cam.h-120+500*(1-v(1)), t:'skip', tz:15, f:'black', bz:0, click: s => {
                    this.chats = [];
                }}, 4, 1)
            ] : []),
            // Top popup
            ...b({x:cam.w/2, y:50*this.pop_c-30, click:s=>this.pop=[]}, 22, 3),
            ...this.pop.map(s=>{
                s.x = cam.w/2;
                s.y = 50*this.pop_c-25;
                return s;
            }),
            // Fade (timeskip)
            ...(this.fade != -1 ? [
                { f:'black', a:1-4*Math.pow(this.fade-0.5,2), p:[[0,0],[],[cam.w,cam.h],[]], click:()=>{} },
            ] : []),
            // Plan
            { f: 'plan.png', o:'nw', s:0.5, y:cam.h*(1-this.help_c) },
            // Game over
            ...(economy.time == 0 && !this.chats.length ? [
                // Dark background
                { f:'black', a:this.gameover_c, p:[[0,0],[],[cam.w,cam.h],[]], click:()=>{} },
                // Title
                { x:cam.w*0.5, y:cam.h*0.25, f:UI.res[1], s:0.35 },
                // Score
                { t:'Score:', f:'white', x:cam.w/2, y:cam.h/2+20 },
                { t:String(economy.points), f:'white', x:cam.w/2, y:cam.h/2+45, a:0.75, tz:25 },
                // Play again
                ...b({x:cam.w/2, y:0.75*cam.h+20, t:'Play Again', f:'black', bz:0, click: s => {
                    location.reload();
                }}, 15, 2),
            ] : [])
        ];
    }
}