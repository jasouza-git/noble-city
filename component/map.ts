import { sprite, Camera, Entity, merge, tile } from '../src/engine';
import { Building } from '../building';
import { Buildings } from '../building/_';
import { economy } from '../src/economy';

export { Building };
export interface map_obj {
    /**
     * Type of Object
     */
    type:string,
    /**
     * X Position
     */
    x:number,
    /**
     * Y Position
     */
    y:number,
    /**
     * Width
     */
    w?:number,
    /**
     * Height
     */
    h?:number,
    /**
     * Vertical direction?
     */
    v?:boolean,
    /**
     * Colors for dynamic coloring system
     */
    color?:string[],
}
export class Map extends Entity {
    static res = [
        'tile/grass_0.png',
        'tile/sand_0.png', 'tile/sand1.png',
        'tile/water_0.png', 'tile/water_1.png',
        'tile/ws_x_0.png', 'tile/ws_y_0.png', 'tile/ws_xy_0.png', 'tile/ws__0.png',
        'tile/ws_x_1.png', 'tile/ws_y_1.png', 'tile/ws_xy_1.png', 'tile/ws__1.png',
        'tile/test.png',
        // Roads
        'road/dirt.png', 'road/dirt_empty.png',
        'road/cement.png', 'road/cement_empty.png',
        // Props
        'prop/tree.png', 'prop/bush.png',
        // Background
        'tile/water_bg_0.png', 'tile/water_bg_1.png',
        // For buildings
        'ui/pin.png',
    ];
    static depend = Buildings;
    /**
     * Layers of the map:
     * 0. Background
     * 1. Foreground
     */
    ly:{[index:string]:sprite}[] = [{},{}];
    /**
     * A building is focused
     */
    focused:(build:Building)=>void = ()=>{};

    /**
     * Generates the map though `map_obj`
     * @param stuff - the map data
     */
    generate(stuff:map_obj[]=[]) {
        this.ly = [{},{}];
        let [ bg, fg ] = this.ly;

        /*for (let x = -10; x < 10; x++)
            for (let y = -10; y < 10; y++)
                bg[`${x}_${y}`] = {data:{pre:'water'}};*/

        for (const s of stuff) {
            let setted = true;
            let p = `${s.x}_${s.y}`;
            if (s.w == undefined) s.w = 1;
            if (s.h == undefined) s.h = 1;
            if (s.type == 'sand') tile([
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
            ], bg, s.x, s.y, s.w, s.h); else if (s.type == 'grass') {
                // Inside
                let n = '';
                for (let x = 0; x < s.w; x++)
                    for (let y = 0; y < s.h; y++)
                        if (bg[n=`${x+s.x}_${y+s.y}`] && bg[n].data?.pre == 'sand')
                            bg[n].data = {...(bg[n].data||{}), top:'grass'}
            } else if (s.type == 'dirt') {
                for (let n = 0; n < s.w; n++) { let p =`${s.v?s.x:s.x+n}_${s.v?s.y+n:s.y}`;
                    if (p in fg) fg[p] = {
                        f: 'road/dirt_empty.png',
                        m: [1.33725,-0.071745,-0.24675,1.2205,0,0],
                    }; else if (p in bg) fg[p] = {
                        f: 'road/dirt.png',
                        m: s.v ? [1.33725,-0.071745,-0.24675,1.2205,0,0] : [-1.27025,-0.39275,0,1.2135,0,0],
                    };
                }
            } else if (s.type == 'cement') {
                for (let n = 0; n < s.w; n++) { let p =`${s.v?s.x:s.x+n}_${s.v?s.y+n:s.y}`;
                    if (p in fg) fg[p] = {
                        f: 'road/cement_empty.png',
                        m: [1.33725,-0.071745,-0.24675,1.2205,0,0],
                    }; else if (p in bg) fg[p] = {
                        f: 'road/cement.png',
                        m: s.v ? [1.33725,-0.071745,-0.24675,1.2205,0,0] : [-1.27025,-0.39275,0,1.2135,0,0],
                    };
                }
            } else if (s.type == 'tree') fg[p] = {
                f: 'prop/tree.png',
                m: [1,0,0,1,0,-25],
            }; else if (s.type == 'bush') fg[p] = {
                f: 'prop/bush.png',
                s: 0.08,
            }; else if (s.type == 'test') fg[p] = {
                f: 'tile/test.png',
                a: 0.5,
            }; else setted = false;
            // Buildings
            if (!setted) for (const Build of Map.depend) if (s.type == Build.key) {
                let b = new Build(this, s.x, s.y, s);
                b.on_focused = b=>this.focused(b);
                fg[p] = {data:{build: b}};
                setted = true;
                economy.own.push(b);
            }
            if (!setted) this.eng?.error_add(new Error(`Unknown type "${s.type}`));
        }
        // Parsing data into map info
        for (const n in this.ly) for (const l in this.ly[n]) {
            let p = l.split('_').map(x=>Number(x));
            let o = this.ly[n][l];
            Object.assign(o, {
                x:p[0]*72+p[1]*64,
                y:p[1]*36-p[0]*19
            });
            // Background Parsing
            if (n == '0') {
                if (o.data?.pre) o.f = `tile/${o.data.top || o.data.pre}_0.png`;
            }
        }
    }
    init:boolean = true;
    render(dt:number, t:number, cam:Camera):sprite[] {
        cam.tile({f:`tile/water_bg_${Math.floor(t/800)%2}.png`, s:0.5});
        for (const n in this.ly[0]) {
            let bg = this.ly[0][n];
            if (bg.data && bg.data.pre && bg.data.pre[0] == 'w' && !bg.data.top)
                bg.f = `tile/${bg.data.pre}_${Math.floor(t/800)%2}.png`;
        }

        return [
            // Base
            {hover: s=>{
                if (s.click) s.cur = 'pointer';
            }},
            // Background
            ...Object.values(this.ly[0]),
            // Foreground
            ...Object.values(this.ly[1]).map(x=>{
                if (x.data?.build) {
                    let b:Building = x.data.build;
                    return [
                        ...merge(b.render(dt, t, cam)),
                        ...merge(b.render_pin(dt, t, cam)),
                    ];
                }
                return [x];
            }).reduce((a,b)=>[...a,...b], []),
        ];
    }
}