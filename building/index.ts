import { Entity, sprite, Camera } from '../src/engine';
import { map_obj } from '../component/map';

/**
 * Represents a building
 * - `focused` - Building is focused
 * - `x` - X Position
 * - `y` - Y Position
 * - `name` - Name of building
 * - `base(dt,t,cam,s)` - Base sprite, use this when rendering building
 */
export class Building extends Entity {
    /* ----- FUNDAMENTAL PROPERTIES ---- */
    /**
     * Building key for map generation
     */
    static key:string = '';
    /**
     * Item Cover
     */
    item:string = '';
    /**
     * Is building being focused by UI?
     */
    focused:boolean = false;
    /**
     * Does user own the building?
     * - `0` - Not ownable
     * - `1` - Public, can be owned
     * - `2` - Owned
     * - `n` - Other players owned
     */
    own:number = 1;
    /**
     * Price of building
     */
    price:number = 0;
    /**
     * Function to call when on focused
     */
    on_focused:(build:Building)=>void = ()=>{};

    /**
     * Popup Pin : Content sprites
     */
    popup:sprite[] = [];
    /**
     * X position
     */
    x:number;
    /**
     * Y position
     */
    y:number;
    /**
     * Title when user focuses on building
     */
    name:string = 'Building';
    /**
     * Base sprite for the relatively drawn building
     * @param dt - Delta-time
     * @param t - Time
     * @param cam - Camera
     * @param s - If you already have a prefered scale and dont want it overwritten, put it here to act has the default scale coefficient
     * @returns - The base sprite, put it has the first sprite in the render output
     */
    base(dt:number, t:number, cam:Camera, s:number=1):sprite { // Base sprite for position and events
        this._c += ((this.focused?0:1)-this._c)*dt*10;
        let c = this._c;
        return {
            c: c,
            x: this.x*c+0.25*cam.w*(1-c),
            y: this.y*c+0.6*cam.h*(1-c),
            s: s*c+1*(1-c),
            click: s => {
                this.focused = true;
                this.on_focused(this);
            },
        };
    }
    private _c = 1; // Transition sprite `c`
    /**
     * Renders popup pin
     */
    render_pin(dt:number, t:number, cam:Camera, s:number=1):sprite[] {
        if (this.popup.length == 0) return [];
        return [ {x: this.x, y: this.y-100},
            {
                f:'ui/pin.png',
                s: 0.25,
                oy: 0.4,
                click: s => {
                    this.focused = true;
                    this.on_focused(this);
                },
            },
            ...this.popup,
        ]
    }
    /**
     * Renders interface for when the building is on focus
     */
    menu(dt:number, t:number, cam:Camera, r:number):sprite[] {
        return [];
    }
    constructor(map:Entity, x:number, y:number, m:map_obj) {
        super();
        this.eng = map.eng;
        this.x = x*72+y*64;
        this.y = y*36-x*19;
    }
}