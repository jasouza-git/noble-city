import { sprite, Camera, Entity, Input, Engine } from './engine';

class LoadMenu extends Entity {
    /**
     * Percentage from 0 to 1
     */
    per:number = 0.5;
    render(dt:number, t:number, game:Engine):sprite[] {
        return [ {}, 
            { // Loading bar border
                p: [[-100, -10],[],[200, 20],[],],
                b: this.per < 0 ? 'red' : 'white',
                bz: 2,
            },
            { // Loading bar percentage
                a: this.per < 0 ? 0 : 1,
                p: [[-96, -6],[],[192*this.per, 12],[],],
                f: 'white'
            },
            { // Loading bar title
                t: this.per < 0 ? 'Error loading assets' : 'Loading...',
                y: -30,
                f: this.per < 0 ? 'red' : 'white',
            },
            { // Error Message
                a: this.per < 0 ? 0.75 : 0,
                t: `failed: ${game.load_err[game.load_err.length-1]}`,
                y: 30,
                tz: 15,
                f: 'red',
            }
        ]
    }
}
class UI extends Entity {
    static res = [
        'coins.png',
        'ui/title.png',
        'ui/resume.png',
        'ui/options.png',
        'ui/exit.png',
        'ui/menu.png',
    ];
    menu:number = 1;
    m:number = 1; // Menu delay
    render(dt:number, t:number, game:Engine, cam:Camera):sprite[] {
        if (dt<1) this.m += (this.menu-this.m)*dt*10;
        return [ {c:0},
            { // Backdrop
                f: 'black',
                p: [[0,0],[],[cam.w, cam.h]],
                a: this.m < 1 ? 0.25*(1-this.m) : 0,
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
interface map_rule {
    type:string,
    x:number,
    y:number,
    w?:number,
    h?:number,
    v?:boolean
}
class Map extends Entity {
    static res = [
        'tile/grass_0.png',
        'tile/sand_0.png', 'tile/sand1.png',
        'tile/water.png',
        'tile/ws_x_0.png', 'tile/ws_y_0.png', 'tile/ws_xy_0.png', 'tile/ws__0.png',
        'tile/ws_x_1.png', 'tile/ws_y_1.png', 'tile/ws_xy_1.png',
        'tile/test.png',
        // Roads
        'road/dirt.png', 'road/dirt_empty.png',
        // Buildings
        'building/fishing.png',
        // Background
        'ocean.png',
    ];
    bg:{[index:string]:sprite} = {}; // Background
    rd:{[index:string]:sprite} = {}; // Roads
    bd:{[index:string]:sprite} = {}; // Buildings
    
    tile(x,y) {
        return {x:x*72+y*64, y:y*36-x*19};
    }
    set_tile(tiles:sprite[], m:{[index:string]:sprite}, x:number=0, y:number=0, w:number=1, h:number=1) {
        let n = '';
        let k:sprite = {};
        let t = (p:number, X:number, Y:number):void => {
            let n = `${x+X}_${y+Y}`;
            let c = 0;
            if (m[n] && m[n].data && m[n].data.p) c = m[n].data.p; 
            let r = structuredClone(tiles[c|p]);
            if (!r.f) r.f = 'tile/test.png';
            r.data = {...(m[n]?.data||{}),...(tiles[c|p]?.data||{}), p:c|p};
            m[n] = r;
        };
        // Inside: 0b1111
        for (let X = 0; X < w; X++)
            for (let Y = 0; Y < h; Y++) t(15,X,Y);
        // North 0b0011
        for (let X = 0; X < w; X++) t(3,X,-1);
        // South 0b1100
        for (let X = 0; X < w; X++) t(12,X,h);
        // West 0b0101
        for (let Y = 0; Y < h; Y++) t(5,-1,Y);
        // East 0b1010
        for (let Y = 0; Y < h; Y++) t(10,w,Y);
        // North West 0b0001
        t(1,-1,-1);
        // North East 0b0010
        t(2,w,-1);
        // South West 0b0100
        t(4,-1,h);
        // South East 0b1000
        t(8,w,h);
    }
    generate(stuff:map_rule[]=[]) {
        let l = (x,y):number => x+13*y+71;
        let rd:{[index:string]:sprite} = {}; this.rd = {};
        let bg:{[index:string]:sprite} = {}; this.bd = {};

        for (const s of stuff) {
            if (s.w == undefined) s.w = 1;
            if (s.h == undefined) s.h = 1;
            if (s.type == 'sand') {
                this.set_tile([
                    {},
                    {data:{pre:'ws_xy'}, m:[0.312,0.463,-2.45,-0.23,-1,1]},
                    {data:{pre:'ws_xy'}, m:[-1,0,0,-1,-1,1]},
                    {data:{pre:'ws_y'},  m:[-1,0,0,-1,-1,1]},
                    {data:{pre:'ws_xy'}},
                    {data:{pre:'ws_x'}},
                    {}, // missing
                    {data:{pre:'ws_'},   m:[-0.2404,-0.45704,2.5288,0.2536,0,0]},
                    {data:{pre:'ws_xy'}, m:[-0.355,0.37,2.31,0.38,-1,1]},
                    {}, // missing
                    {data:{pre:'ws_x'},  m:[-1,0,0,-1,-1,1]},
                    {data:{pre:'ws_'},   m:[1,0,0,1,-2,0]},
                    {data:{pre:'ws_y'}},
                    {data:{pre:'ws_'},   m:[0.95175,0.235,0.275,-0.951,0,0.6285]},
                    {data:{pre:'ws_'},   m:[0.26139,0.4746,-2.4687,-0.27096,4.952,2.076]},
                    {data:{pre:'sand'}},
                ], bg, s.x, s.y, s.w, s.h);
            } else if (s.type == 'grass') {
                // Inside
                let n = '';
                for (let x = 0; x < s.w; x++)
                    for (let y = 0; y < s.h; y++) 
                        if (bg[n=`${x+s.x}_${y+s.y}`] && bg[n].data?.pre == 'sand') bg[n].data = {...(bg[n].data||{}), top:'grass'}
            }/* else if (s.type == 'dirt') {
                for (let n = 0; n < s.w; n++) { let p =`${s.v?s.x:s.x+n}_${s.v?s.y+n:s.y}`;
                    if (p in rd) rd[p] = {
                        f: 'road/dirt_empty.png',
                        m: [1.33725,-0.071745,-0.24675,1.2205,0,0],
                    };
                    // Can only be placed in grass
                    else if (p in bg && bg[p].f == 'tile/grass.png') rd[p] = {
                        f: 'road/dirt.png',
                        //...pos,
                        m: s.v ? [1.33725,-0.071745,-0.24675,1.2205,0,0] : [-1.27025,-0.39275,0,1.2135,0,0],
                        //m: s.v ? [-0.8275,-0.1545,-0.673,0.911,0,0] : [0.8555,0.0285,0.38624,0.85325,0,0],
                    };
                }
            } else if (s.type == 'fishing') rd[`${s.x}_${s.y}`] = {
                f: 'building/fishing.png',
                s: 0.75,
                m: [1,0,0,1,5,-35]
            };*/
        }
        // Parsing data into map info
        for (const b in bg) {
            let p = b.split('_').map(x=>Number(x));
            Object.assign(bg[b], this.tile(p[0], p[1]));
            if (bg[b].data.pre) bg[b].f = `tile/${bg[b].data.top || bg[b].data.pre}_0.png`;
            /*let s = typeof bg[b].data == 'string';
            let p = b.split('_').map(x=>Number(x));
            if (!s) Object.assign(bg[b], {f:'tile/test.png', a:0.5})
            else if (bg[b].data == 'gnd' && bg[b].f == undefined) bg[b].f = 'tile/sand1.png';
            else if (bg[b].data.startsWith('ws')) bg[b].f = `tile/${bg[b].data}_0.png`;
            Object.assign(bg[b], this.tile(p[0], p[1]));
            delete bg[b].data;*/
        }
        for (const r in rd) {
            let p = r.split('_').map(x=>Number(x));
            Object.assign(rd[r], this.tile(p[0], p[1]));
        }
        this.bg = bg;
        this.rd = rd;
        console.log(this.bg);
        /*
        // Cleanup
        for (const bg of this.bg) {
            if (typeof bg.data == 'string') {
                if (bg.data.startsWith('ws')) bg.f = `tile/${bg.data}_1.png`;
                else if (bg.data == 'gnd' && bg.f == 'tile/water.png') bg.f = 'tile/sand1.png';
                else if (bg.data == '') {
                    bg.f = 'tile/test.png';
                    bg.a = 0.25;
                }
            } 
        }
        this.rd = Object.keys(rd).map(x=>rd[x]);*/
        //console.log(this.rd);
        //for (let n = 0; n < 20; n++) this.bg[Math.floor(Math.random()*this.bg.length)].f = Map.res[Math.floor(Math.random()*6)+1];
        
    }
    init:boolean = true;
    render(dt:number, t:number, game:Engine, cam:Camera):sprite[] {
        cam.tile({f:'ocean.png', s:1});
        /*if (this.init) {
            game.debug.m = [0.26139,0.4746,-2.4687,-0.27096,0,0];
            game.debug._m = [...game.debug.m];
            this.init = false;
        }
        game.debug.mp(dt);
        this.bg['0_2'].m = game.debug.m;*/
        return [ {},
            // Background
            ...Object.values(this.bg),
            ...Object.values(this.rd),
            /*{
                f: 'tile/test.png',
                ...this.tile(0,2),
                a: 0.5,
            },
            this.bg['0_2'],*/
        ]
    }
}
class Fishing extends Entity {
    static res = ['building/fishing.png'];
    tile(x,y) {
        return {x:x*72+y*64, y:y*36-x*19};
    }
    render(dt:number, t:number, game:Engine):sprite[] {
        return [{},
            {
                f: Fishing.res[0],
                ...this.tile(0,0),
            }
        ]
    }
}
class NobleCity {
    game:Engine;
    cam:Camera;
    ui = new UI;
    loadmenu = new LoadMenu;
    map = new Map;
    mapdat:map_rule[] = [
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
    resize() {
        let rw = this.cam.w/this.cam.h;
        let rs = innerWidth/innerHeight;
        if (rs > rw) {
            this.cam.dom.style.width = 'auto';
            this.cam.dom.style.height = '100%';
        } else {
            this.cam.dom.style.width = '100%';
            this.cam.dom.style.height = 'auto';
        }
    }
    constructor(dom:HTMLCanvasElement|string='') {
        this.game = new Engine;
        this.game.base = '/assets/';
        this.cam = new Camera(dom, this.game);
        this.cam.x = 200;
        addEventListener('resize', ()=>this.resize);
        this.resize();

        // Loading scene
        this.game.scenes.push([this.loadmenu]);
        this.game.scenes.push([this.map, this.ui]);
        this.game.scene = 0;

        // Generate map
        this.map.generate(this.mapdat);

        // Load assets
        this.game.load((a,b) => {
            this.loadmenu.per = a/b;
            if (a/b == 1) this.game.scene = 1;
        }, UI, Map);

        // Main loop
        this.game.loop = (dt:number, t:number, cam:Camera) => this.loop(dt,t,cam);
    }
    pos:number[] = [-1,3,1,3];
    loop(dt:number, t:number, cam:Camera) {

        if (this.ui.menu == 0) return;
        let inp = this.game.inp;

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
    }
}

let game = new NobleCity('#game');
