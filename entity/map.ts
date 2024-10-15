import { sprite, Camera, Entity, Engine } from '../engine';

export interface map_obj {
    type:string,
    x:number,
    y:number,
    w?:number,
    h?:number,
    v?:boolean
}
export class Map extends Entity {
    static res = [
        'tile/grass_0.png',
        'tile/sand_0.png', 'tile/sand1.png',
        'tile/water.png',
        'tile/ws_x_0.png', 'tile/ws_y_0.png', 'tile/ws_xy_0.png', 'tile/ws__0.png',
        'tile/ws_x_1.png', 'tile/ws_y_1.png', 'tile/ws_xy_1.png',
        'tile/test.png',
        // Roads
        'road/dirt.png', 'road/dirt_empty.png',
        'road/cement.png', 'road/cement_empty.png',
        // Buildings
        'building/fishing.png',
        'building/callereal.png',
        'building/bank.png',
        'building/farm.png',
        'building/factory.png',
        // Props
        'prop/tree.png',
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
    generate(stuff:map_obj[]=[]) {
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
            } else if (s.type == 'dirt') {
                for (let n = 0; n < s.w; n++) { let p =`${s.v?s.x:s.x+n}_${s.v?s.y+n:s.y}`;
                    if (p in rd) rd[p] = {
                        f: 'road/dirt_empty.png',
                        m: [1.33725,-0.071745,-0.24675,1.2205,0,0],
                    };
                    // Can only be placed in grass
                    else if (p in bg) rd[p] = {
                        f: 'road/dirt.png',
                        m: s.v ? [1.33725,-0.071745,-0.24675,1.2205,0,0] : [-1.27025,-0.39275,0,1.2135,0,0],
                    };
                }
            } else if (s.type == 'cement') {
                for (let n = 0; n < s.w; n++) { let p =`${s.v?s.x:s.x+n}_${s.v?s.y+n:s.y}`;
                    if (p in rd) rd[p] = {
                        f: 'road/cement_empty.png',
                        m: [1.33725,-0.071745,-0.24675,1.2205,0,0],
                    };
                    // Can only be placed in grass
                    else if (p in bg) rd[p] = {
                        f: 'road/cement.png',
                        m: s.v ? [1.33725,-0.071745,-0.24675,1.2205,0,0] : [-1.27025,-0.39275,0,1.2135,0,0],
                    };
                }
            } else if (s.type == 'fishing') rd[`${s.x}_${s.y}`] = {
                f: 'building/fishing.png',
                s: 0.75,
                m: [1,0,0,1,5,-35],
                p: [
                    [-70, -80],
                    [],
                    [145, 110],
                    [],
                ],
                click: s => this.eng?.act('building'),
            }; else if (s.type == 'callereal') rd[`${s.x}_${s.y}`] = {
                f: 'building/callereal.png',
                p: [
                    [-85, -140],
                    [],
                    [185, 160],
                    [],
                ],
                m: [1,0,0,1,0,-60],
                click: s => this.eng?.act('building'),
            }; else if (s.type == 'bank') rd [`${s.x}_${s.y}`] = {
                f: 'building/bank.png',
                p: [
                    [-62, -100],
                    [],
                    [133, 130],
                    [],
                ],
                m: [1,0,0,1,4,-32],
                click: s => this.eng?.act('building'),
            }; else if (s.type == 'farm') rd [`${s.x}_${s.y}`] = {
                f: 'building/farm.png',
                p: [
                    [-62, -100],
                    [],
                    [133, 130],
                    [],
                ],
                click: s => this.eng?.act('building'),
            }; else if (s.type == 'factory') rd [`${s.x}_${s.y}`] = {
                f: 'building/factory.png',
                p: [
                    [-62, -100],
                    [],
                    [133, 130],
                    [],
                ],
                s: 0.5,
                m: [1,0,0,1,0,-50],
                click: s => this.eng?.act('building'),
            }; else if (s.type == 'tree') rd [`${s.x}_${s.y}`] = {
                f: 'prop/tree.png',
                p: [
                    [-62, -100],
                    [],
                    [133, 130],
                    [],
                ],
                s: 0.08,
            }; else {
                this.eng?.error_add(new Error(`Unknown type "${s.type}`));
            }
        }
        // Parsing data into map info
        for (const b in bg) {
            let p = b.split('_').map(x=>Number(x));
            Object.assign(bg[b], this.tile(p[0], p[1]));
            if (bg[b].data?.pre) bg[b].f = `tile/${bg[b].data.top || bg[b].data.pre}_0.png`;
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
    render(dt:number, t:number, cam:Camera):sprite[] {
        cam.tile({f:'ocean.png', s:1});
        /*if (this.init) {
            game.debug.m = [0.26139,0.4746,-2.4687,-0.27096,0,0];
            game.debug._m = [...game.debug.m];
            this.init = false;
        }
        game.debug.mp(dt);
        this.bg['0_2'].m = game.debug.m;*/
        return [ {hover: s=>{
                if (s.click && this.eng?.act('onmap?')) s.cur = 'pointer';
            }},
            // Background
            ...Object.values(this.bg),
            ...Object.values(this.rd),
            {
                f: 'tile/test.png',
                ...this.tile(-1,0),
                a: 0.5,
            },/*
            this.bg['0_2'],*/
        ]
    }
}