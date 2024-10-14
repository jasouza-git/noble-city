

/**
 * Fundamental rendering object of the engine
 * All default values is located at `camera.def`
 * **Position**
 * - `x`  - X Position of sprite, default 0
 * - `y`  - Y Position of sprite, default 0
 * - `z`  - Z Position of sprite *(if 3d)*, default 0
 * - `sx` - Horizontal scale, default 1 *(only effects images)*
 * - `sy` - Vertical scale, default 1 *(only effects images)*
 * - `s`  - Scale in both axis, default 1 *(only effects images)*
 * - `sz` - Forward scale *(id 3d)*, default 1
 * - `r`  - Angle rotation in Radians, defaults 0
 * - `o`  - Origin cardinal direction includes "nsew", default "" *(center)*
 * - `c`  - Camera coefficent from 0 *(fixed)* to 1 *(relative)*, default 1
 * - `m`  - Matrix transformation, must have 6 numbers
 * 
 * **Rendering**
 * - `f`  - The filled texture *(color/image)* of the shape
 * - `b`  - The border texture *(color/image)* of the shape
 * - `bz` - The border width in pixels, default 1
 * - `p`  - Path relative to origin, below are behavior based on length
 *          If path length is zero, then a point of origin
 *   0) Closes path, if two or less than turns it to rectangle
 *   1) Expands last point to arc has radius
 *   2) Represents a point *(if no other points)* or line
 *   3) Represents a point/line *(if 3d)*
 *   4) Represents a quadratic curve
 *   6) Represents a bezier curve
 * - `crop` - Rectangle image offset relative to "ne"
 * - `a` - Alpha opacity from 0 *(hidden)* to 1 *(visible)*
 * 
 * **Text**
 * - `t` - Text to display
 * - `tf` - Text font, default "Arial"
 * - `tz` - Text size, default 20
 * - `ts` - Text spacing in pixels, default 0
 * 
 * **Custom**
 * - `data` - Custom data
 * 
 * **System**
 * - `cur` - Sets mouse cursor
 * 
 * **Events** *(requires points `p`)*
 * - `click` - Mouse clicked on it 
 * - `hover` - Mouse hovered on it
 */
export interface sprite {
    /**
     * X Position of sprite, default 0
     */
    x?:number,
    /**
     * Y Position of sprite, default 0
     */
    y?:number,
    /**
     * Z Position of sprite *(if 3d)*, default 0
     */
    z?:number,
    /**
     * Horizontal scale, default 1 *(only effects images)*
     */
    sx?:number,
    /**
     * Vertical scale, default 1 *(only effects images)*
     */
    sy?:number,
    /**
     * Forward scale *(id 3d)*, default 1
     */
    sz?:number,
    /**
     * Scale in both axis, default 1 *(only effects images)*
     */
    s?:number,
    /**
     * Angle rotation in Radians, defaults 0
     */
    r?:number,
    /**
     * Origin cardinal direction includes "nsew", default "" *(center)*
     */
    o?:''|'n'|'e'|'w'|'s'|'ne'|'nw'|'se'|'sw',
    /**
     * Camera coefficent from 0 *(fixed)* to 1 *(relative)*, default 1
     */
    c?:number,
    /**
     * Matrix transformation, must have 6 numbers
     */
    m?:number[],
    /**
     * The filled texture *(color/image)* of the shape
     */
    f?:string,
    /**
     * The border texture *(color/image)* of the shape
     */
    b?:string,
    /**
     * The border width in pixels, default 1
     */
    bz?:number,
    /**
     * Border ends can be:
     * - `""` - Nothing in the end
     * - `"arc"` - Circle in the end
     * - `"sqr"` - Square in the end 
     */
    be?:''|'arc'|'sqr',
    /**
     * Border joints can be:
     * - `""` - Pointing joint
     * - `"arc"` - Circular joint
     * - `"sqr"` - Square joint
     */
    bj?:''|'arc'|'sqr',
    /**
     * Path relative to origin, below are behavior based on length
     * If path length is zero, then a point of origin
     *   0) Closes path, if two or less than turns it to rectangle
     *   1) Expands last point to arc has radius
     *   2) Represents a point *(if no other points)* or line
     *   3) Represents a point/line *(if 3d)*
     *   4) Represents a quadratic curve
     *   6) Represents a bezier curve
     */
    p?:number[][],
    /**
     * Rectangle image offset relative to "ne"
     * [x, y, w, h]
     */
    crop?:number[],
    /**
     * Alpha opacity from 0 *(hidden)* to 1 *(visible)*
     */
    a?:number,
    /**
     * Text to display
     */
    t?:string,
    /**
     * Text font, default "Arial"
     */
    tf?:string,
    /**
     * Text size, default 20
     */
    tz?:number,
    /**
     * Text spacing in pixels, default 0
     */
    ts?:number,
    /**
     * Custom Data
     */
    data?:any,
    /**
     * Sets mouse cursor
     * 
     * [Cursor reference](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)
     */
    cur?:string,
    /**
     * Mouse clicked on it *(requires points `p`)*
     */
    click?:(s:sprite)=>void,
    /**
     * Mouse hovered on it *(requires points `p`)*
     */
    hover?:(s:sprite)=>void,
};
/**
 * Camera responsible for rendering the environment
 */
export class Camera {
    /**
     * X position
     */
    x:number = 0;
    /**
     * Y position
     */
    y:number = 0;

    /**
     * Width of canvas
     */
    get w():number { return this.dom.width; }
    set w(v:number) { this.dom.width = v; }
    /**
     * Height of canvas
     */
    get h():number { return this.dom.height; }
    set h(v:number) { this.dom.height = v; }
    /**
     * Scale of canvas
     */
    set s(v:number) {
        //this._ctx.scale(v/this.sx, v/this.sy);
        /*this.dom.width = this.dom.width*v;
        this.dom.height = this.dom.height*v;*/
        this.sx = v;
        this.sy = v;
    }
    sx:number = 1;
    sy:number = 1;

    /**
     * Renders sprites
     */
    def:sprite = {
        bz: 1,
    };
    /**
     * Camera cursor
     */
    cursor:string = 'default';
    render(base:sprite={}, ...sprites:sprite[]) {
        let cur = this.cursor;
        for (const sp of sprites) {
            this._ctx.save();

            // Object
            let s:sprite = {};
            Object.assign(s, this.def, base, sp);
            let val = (...a:any[]) => a.filter(x=>x!=undefined)[0];

            // Event
            let inp = this._eng.inp;
            if ((s.click || s.hover) && s.p != undefined && inp.over(s.p, [s.x||0,s.y||0], s.c)) {
                if (s.hover) s.hover(s);
                if (inp.click() && s.click) s.click(s);
            }
            if (s.cur) cur = s.cur;

            // Conditions
            let cf:boolean = s.f != undefined && !(s.f in this._eng.imgs); // Color fill?
            let cb:boolean = s.b != undefined && !(s.b in this._eng.imgs); // Color stroke?
            let cc:boolean = s.crop != undefined && s.crop.length == 4;     // Valid rectangle
            
            // Fill and Stroke
            if (cf) this._ctx.fillStyle = s.f!;
            if (cb) this._ctx.strokeStyle = s.b!;
            this._ctx.lineCap = s.be == 'arc' ? 'round' : s.be == 'sqr' ? 'square' : 'butt';
            this._ctx.lineJoin = s.bj == 'arc' ? 'round' : s.bj == 'sqr' ? 'bevel' : 'miter';
            this._ctx.lineWidth = val(s.bz, this.def.bz, 1);
            
            // Alpha
            this._ctx.globalAlpha = val(s.a, this.def.a, 1);

            // Camera
            // P\left(x,y\right)=\left[xz_{cam}^c+\frac{w}{2}cz_{cam}^{c-1}+x_{cam}(1-c-z_{cam}^c),yz_{cam}^c+\frac{h}{2}cz_{cam}^{c-1}+y_{cam}(1-c-z_{cam}^c)\right]
            this._ctx.save();
            let c:number = val(s.c, this.def.c, 1);
            let csx = Math.pow(this.sx, c);
            let csy = Math.pow(this.sy, c);
            let sx:number = val(s.sx, s.s, this.def.sx, this.def.s, 1);
            let sy:number = val(s.sy, s.s, this.def.sy, this.def.s, 1);
            sx *= csx;
            sy *= csy;
            let rs = 0; // Rotate sine matrix
            let rc = 1; // Rotate cosine matrix
            if (s.r) {
                rs = Math.sin(s.r);
                rc = Math.cos(s.r);
            }
            this._ctx.transform(sx*rc,sx*rs,-sy*rs, sy*rc,  this.w/2*c*Math.pow(this.sx, c-1)+this.x*(1-c-csx)+(s.x||0)*csx,
                                                            this.h/2*c*Math.pow(this.sy, c-1)+this.y*(1-c-csy)+(s.y||0)*csy);
            if (s.m && s.m.length == 6) this._ctx.transform.apply(this._ctx, s.m);
            else if (s.m) this._eng.error_add(new Error(`Invalid transform [${s.m.toString()}]`))
            
            // Origin
            this._ctx.textAlign = 'left';
            this._ctx.textBaseline = 'top';
            let op = [0,0]; // Offset Position
            if (!s.o || !s.o.includes('w') && !s.o.includes('e')) { // Horizontal centering
                if (s.crop && cc) op[0] -= s.crop[2]/2;
                else if(s.f && !cf) op[0] -= this._eng.imgs[s.f].width/2;
                this._ctx.textAlign = 'center';
            }
            if (!s.o || !s.o.includes('n') && !s.o.includes('s')) { // Vertical centering
                if (s.crop && cc) op[1] -= s.crop[3]/2;
                else if(s.f && !cf) op[1] -= this._eng.imgs[s.f].height/2;
                this._ctx.textBaseline = 'middle';
            }
            if (s.o && s.o.includes('e')) { // Horizontal align to end
                if (s.crop && cc) op[0] -= s.crop[2];
                else if (s.f && !cf) op[0] -= this._eng.imgs[s.f].width;
                this._ctx.textAlign = 'end';
            }
            if (s.o && s.o.includes('s')) { // Vertical align to end
                if (s.crop && cc) op[1] -= s.crop[3];
                else if (s.f && !cf) op[1] -= this._eng.imgs[s.f].width;
                this._ctx.textBaseline = 'bottom';
            }
            this._ctx.translate(op[0], op[1]);

            // Image
            if (s.f != undefined && s.f in this._eng.imgs) {
                if (s.crop && cc) this._ctx.drawImage(this._eng.imgs[s.f], s.crop[0], s.crop[1], s.crop[2], s.crop[3], 0, 0, s.crop[2], s.crop[3]);
                else              this._ctx.drawImage(this._eng.imgs[s.f], 0, 0);
                if (cb && s.p == undefined) {
                    if (s.crop && cc) this._ctx.strokeRect(0, 0, s.crop[2], s.crop[3]);
                    else              this._ctx.strokeRect(0, 0, this._eng.imgs[s.f].width, this._eng.imgs[s.f].height);
                }
            }

            // Position without scalling
            let ta = this._ctx.textAlign;
            let tb = this._ctx.textBaseline;
            this._ctx.restore();
            this._ctx.textAlign = ta;
            this._ctx.textBaseline = tb;
            this._ctx.transform(csx*rc,csx*rs,-csy*rs,csy*rc,   this.w/2*c*Math.pow(this.sx, c-1)+this.x*(1-c-csx)+(s.x||0)*csx,
                                                                this.h/2*c*Math.pow(this.sy, c-1)+this.y*(1-c-csy)+(s.y||0)*csy);
            
            // Path
            if (s.p) {
                let n = 0; // Number of points passed
                let m = 0; // Mode
                this._ctx.beginPath();
                for (const p of s.p) {
                    // Starting point
                    if (p.length == 2 && !n) this._ctx.moveTo(p[0], p[1]);
                    // Rectangle mode
                    else if (p.length == 2 && m == 1) {
                        this._ctx.lineTo(s.p[n-2][0]+p[0], s.p[n-2][1]);
                        this._ctx.lineTo(s.p[n-2][0]+p[0], s.p[n-2][1]+p[1]);
                        this._ctx.lineTo(s.p[n-2][0], s.p[n-2][1]+p[1]);
                        //this._ctx.lineTo(s.p[n-2][0], s.p[n-2][1]);
                    // Straight line
                    } else if (p.length == 2)  this._ctx.lineTo(p[0], p[1]);
                    // Enable rectangle mode
                    else if (p.length == 0 && n>0 && s.p[n-1].length == 2 && n+1 != s.p.length && s.p[n+1].length == 2)
                        m = 1;
                    // Close path
                    else if (p.length == 0 && n+1 == s.p.length) this._ctx.closePath();
                    // Next point
                    n++;
                }
                if (cf) this._ctx.fill();
                if (cb) this._ctx.stroke();
            }

            // Text
            if (s.t) {
                this._ctx.font = `${s.tz != undefined ? s.tz : 20}px ${s.tf != undefined ? s.tf : 'Arial'}`;
                if (!cf) this._ctx.fillStyle = '#000';
                if (!cf && !cb || cf) this._ctx.fillText(s.t, 0, 0);
                if (cb) this._ctx.strokeText(s.t, 0, 0);
            }

            // Restore
            this._ctx.restore();
        }
        this.dom.style.cursor = cur;
    }
    /**
     * Clears scene
     */
    clear() {
        this._ctx.clearRect(0, 0, this.w, this.h);
    }

    /**
     * Titles the canvas infinitely using only one sprite
     */
    tile(s:sprite) {
        let sx = s.sx != undefined ? s.sx : s.s != undefined ? s.s : this.def.sx != undefined ? this.def.sx : this.def.s != undefined ? this.def.s : 1;
        let sy = s.sy != undefined ? s.sy : s.s != undefined ? s.s : this.def.sy != undefined ? this.def.sy : this.def.s != undefined ? this.def.s : 1;
        let bcr = this.dom.getBoundingClientRect()
        let rx = bcr.width/this.w;
        let ry = bcr.height/this.h;
        if (!s.f || !(s.f in this._eng.imgs)) {
            if(s.f != undefined) this.dom.style.background = s.f;
        } else {
            this.dom.style.backgroundImage = `url(${this._eng.base}${s.f})`;
            this.dom.style.backgroundPosition = `calc(50% + ${((s.x||0)-this.x)*this.sx*rx}px) calc(50% + ${((s.y||0)-this.y)*this.sy*ry}px)`;
            this.dom.style.backgroundSize = `${this._eng.imgs[s.f].width*this.sx*sx}px ${this._eng.imgs[s.f].height*this.sy*sy}px`;
        }
    }

    /**
     * Camera DOM Element (Canvas)
     */
    dom:HTMLCanvasElement;
    /* MAIN */
    private _ctx:CanvasRenderingContext2D;
    private _eng:Engine;
    constructor(dom:HTMLCanvasElement|string='', eng:Engine, w=640, h=360) {
        this.dom = typeof dom != 'string' ? dom : dom.length && document.querySelector(dom) ? document.querySelector(dom)! : document.createElement('canvas');
        this.dom.style.aspectRatio = `${w} / ${h}`;
        this.w = w;
        this.h = h;
        this._ctx = this.dom.getContext('2d')!;
        this._ctx.imageSmoothingEnabled = false;
        this._eng = eng;
        eng.cameras.push(this);
        eng.inp.bind(this);
    }
}
/**
 * Inputs responsible for handling hardware inputs
 * **Mouse**
 * - `x` - X position relative to canvas
 * - `y` - Y position relative to canvas
 * - `rx` - X position relative to camera
 * - `ry` - Y position relative to camera
 * - `b` - Button being pressed (bits 1-3)
 * - `sx` - Scrolled X distance
 * - `sy` - Scrolled Y distance
 * - `d*` - Gets the changed value since last frame *(delta)*
 * - `g*` - Gets the changed value since mouse down *(dragged)*
 * - `cb(n,x)` - Returns true if boolean at `n` is `x` for button `b`
 * **Methods**
 * - `handle(event)` - Deals with events
 * - `listen(dom)` - Listens for events at `dom`
 */
export class Input {
    /**
     *  X position relative to canvas
     */
    x:number = 0;   private _x:number = 0;  private _gx:number = 0;
    /**
     * Delta X absolute position since last frame
     */
    get dx():number     { return this.x  - this._x; }
    set dx(v:number)    { this._x = this.x - v; }

    /**
     * Y position relative to canvas
     */
    y:number = 0;   private _y:number = 0;  private _gy:number = 0;
    /**
     * Delta Y absolute position since last frame
     */
    get dy():number     { return this.y  - this._y; }
    set dy(v:number)    { this._y = this.y - v; }

    /**
     * X position relative to camera
     */
    rx:number = 0;  private _rx:number = 0; private _grx:number = 0;
    /**
     * Delta X relative position since last frame
     */
    get drx():number     { return this.rx  - this._rx; }
    set drx(v:number)    { this._rx = this.rx - v; }

    /**
     * Y position relative to camera
     */
    ry:number = 0;  private _ry:number = 0; private _gry:number = 0;
    /**
     * Delta X relative position since last frame
     */
    get dry():number     { return this.ry  - this._ry; }
    set dry(v:number)    { this._ry = this.ry - v; }

    /**
     * Button being pressed (bits 1-3)
     */
    b:number = 0;   private _b:number = 0;
    /**
     * Delta button since last frame
     */
    get db():number     { return this.b  ^ this._b; }
    set db(v:number)    { this._b = this.b ^v; }
    /**
     * Delta button of specific type and expected value
     */
    cb(n:number, x:number|null=null):boolean { return (this.db&n) != 0 && (x==null ? (this.b&n)!=0 : (this.b&n)==x); }

    /**
     * Scrolled X distance
     */
    sx:number = 0;  private _sx:number = 0;
    /**
     * Delta scrolled X distance since last frame
     */
    get dsx():number     { return this.sx  - this._sx; }
    set dsx(v:number)    { this._sx = this.sx - v; }

    /**
     * Scrolled Y distance
     */
    sy:number = 0;  private _sy:number = 0;
    /**
     * Delta scrolled Y distance since last frame
     */
    get dsy():number     { return this.sy  - this._sy; }
    set dsy(v:number)    { this._sy = this.sy - v; }

    /**
     * Dragged X absolute position
     */
    get gx(): number    { return this.x  - this._gx; }
    /**
     * Dragged Y absolute position
     */
    get gy(): number    { return this.y  - this._gy; }
    /**
     * Dragged X relative position
     */
    get grx(): number   { return this.rx - this._grx; }
    /**
     * Dragged Y relative position
     */
    get gry(): number   { return this.ry - this._gry; }
    /**
     * Dragged absolute hypotenuse
     */
    get g(): number     { return Math.hypot(this.gx,  this.gy);  }
    /**
     * Dragged relative hypotenuse
     */
    get gr(): number    { return Math.hypot(this.grx, this.gry); }

    /**
     * Checks if there was a click
     */
    click(treshold:number=1):boolean { return this.g < treshold && this.cb(1,0); }
    /**
     * Checks if the cursor is over sprite
     */
    over(poly:number[][], pos:number[]=[0,0], cval?:number):boolean {
        let c = cval != undefined ? cval : this._cam.def.c != undefined ? this._cam.def.c : 1;
        let rx = (this.x-this._cam.w/2*c+this._cam.x*c)*Math.pow(this._cam.sx, -c)-pos[0];
        let ry = (this.y-this._cam.h/2*c+this._cam.y*c)*Math.pow(this._cam.sy, -c)-pos[1];
        let sec = false;
        for (let i=0, j=poly.length-1; i<poly.length; j=i++) {
            let p2 = poly[i].length == 2 && poly[j].length == 2;
            // Skip close path
            if (i == 0 && poly[j].length == 0) j--;
            // Rectangle over
            if (i!=0 && i+1<poly.length && poly[i].length == 0 && poly[i-1].length == 2 && poly[i+1].length == 2) {
                let xi=poly[i-1][0], yi=poly[i-1][1];
                let xj=xi+poly[i+1][0], yj=yi+poly[i+1][1];
                if ((yi>ry) !== (yj>ry) && (xi>rx) !== (xj>rx)) sec = !sec;
                i++;
            // Polynomial
            } else if (p2) {
                let xi=poly[i][0], yi=poly[i][1];
                let xj=poly[j][0], yj=poly[j][1];
                if ((yi>ry) !== (yj>ry) && rx < (xj-xi)*(ry-yi)/(yj-yi)+xi) sec = !sec;
            }
        }
        return sec;
    }
    /**
     * Checks if mouse is inside absolute rectangles
     */
    in(...rects:number[]):boolean {
        for (const r of rects)
            if (this.x > r[0] && this.x < r[0]+r[2] && this.y > r[1] && this.y < r[1]+r[3])
                return true;
        return false;
    }
    /**
     * Checks if mouse is inside relative rectangles
     */
    rin(...rects:number[]):boolean {
        for (const r of rects)
            if (this.rx > r[0] && this.rx < r[0]+r[2] && this.ry > r[1] && this.ry < r[1]+r[3])
                return true;
        return false;
    }

    /**
     * Keys in binary map, bits:
     * 1. CTRL Key
     * 2. Shift Key
     * 3. Alt Key
     */
    key:{[index:string]:number} = {};
    /**
     * Change in key *(-1 if unset)*
     */
    dkey:{[index:string]:number} = {};

    /**
     * Handles events
     */
    handle(e:Event) {
        if (e instanceof WheelEvent) {
            this.sx += e.deltaX;
            this.sy += e.deltaY;
        } else if (e instanceof MouseEvent) {
            const r = this._cam.dom.getBoundingClientRect();
            const i = this._cam.w/this._cam.h;
            const d = i > r.width/r.height ? [r.width, r.width/i] : [r.height*i, r.height];
            this.x = (e.clientX-r.left-(r.width-d[0])/2)/d[0]*this._cam.w;
            this.y = (e.clientY-r.top-(r.height-d[1])/2)/d[1]*this._cam.h;
            this.rx = (this.x-this._cam.w/2+this._cam.x)/this._cam.sx;
            this.ry = (this.y-this._cam.h/2+this._cam.y)/this._cam.sy;
            this.b = e.buttons;
            if (this.cb(1)) {
                this._gx = this.x;
                this._gy = this.y;
                this._grx = this.rx;
                this._gry = this.ry;
            }
            e.preventDefault();
        } else if (e instanceof KeyboardEvent) {
            if (e.type == 'keydown')
                this.key[e.key.toLowerCase()] = this.dkey[e.key.toLowerCase()] = Number(e.ctrlKey)+(Number(e.shiftKey)<<1)+(Number(e.altKey)<<2);
            else {
                delete this.key[e.key.toLowerCase()];
                this.dkey[e.key.toLowerCase()] = -1;
            }
        }
    }
    /**
     * Resets delta changes
     */
    reset() {
        this.dx = 0;
        this.dy = 0;
        this.db = 0;
        this.dsx = 0;
        this.dsy = 0;
        this.drx = 0;
        this.dry = 0;
        this.dkey = {};
    }

    /**
     * Main constructor
     */
    constructor(eng:Engine) { this._eng = eng; }
    private _eng:Engine;
    bind(cam:Camera) {
        this._cam = cam;
        addEventListener('wheel',       e=>this.handle(e));
        addEventListener('mousemove',   e=>this.handle(e));
        addEventListener('mouseover',   e=>this.handle(e));
        addEventListener('mousedown',   e=>this.handle(e));
        addEventListener('mouseup',     e=>this.handle(e));
        addEventListener('mouseenter',  e=>this.handle(e));
        addEventListener('mouseout',    e=>this.handle(e));
        addEventListener('keydown',     e=>this.handle(e));
        addEventListener('keyup',       e=>this.handle(e));
    }
    private _cam:Camera;
}
/**
 * Entity class in Engine environment
 */
export class Entity {
    /**
     * Resources to be loaded before the entity can be used
     */
    static res:string[] = [];

    /**
     * Renders the entity, the first entity represents the base entity
     * @param dt {number} Delta-time in seconds
     * @param t {number} Total time passed since start in miliseconds
     * @param game {Engine} The main engine of the game
     * @param cam {Camera} The camera being rendered to
     * @returns {sprite[]} Sprites to render
     */
    render(dt:number, t:number, game:Engine, cam:Camera):sprite[] {
        return [];
    }

    /* MAIN */
    constructor(...x:any[]) {}
}
/**
 * Engine responsible for processing the whole game and its components
 */
export class Engine {
    /**
     * Images cache
     */
    imgs:{[index:string]:HTMLImageElement} = {};
    /**
     * Loads file into cache
     * @param state Function to call for each loaded update
     * @param files Files to load
     */
    load_res(state:(loaded:number,toload:number)=>void, ...files:string[]) {
        let loaded = 0;
        state(0, files.length);
        for (const file of files) {
            let img = new Image();
            img.onload = () => state(loaded == -1 ? -1 : ++loaded, files.length);
            img.onerror = () => {
                loaded = -1;
                this.load_err.push(this.base+file);
                state(-1, files.length);
            };
            img.src = this.base+file;
            this.imgs[file] = img;
        }
    };
    load_err:string[] = [];
    
    // ERRORS
    errors:Error[] = [];
    error_add(err:Error) {
        for (const e of this.errors) if(e.message == err.message) return;
        this.errors.push(err);
        console.log(err);
    }

    base:string = '';
    /**
     * Load entities
     */
    load(state:(loaded:number,toload:number)=>void, ...entities:typeof Entity[]) {
        let toload:string[] = [];
        for (const entity of entities) toload.push(...entity.res);
        this.load_res(state, ...toload)
    }
    /**
     * Cameras
     */
    cameras:Camera[] = [];
    /**
     * Inputs
     */
    inp:Input;

    /**
     * Useful for debugging
    */
    debug:{m:number[], _m:number[], mp:(dt:number)=>void} = {
        /**
         * Matrix tranform
         */
        m: [1,0,0,1,0,0],
        _m: [1,0,0,1,0,0],
        /**
         * Matrix play
         */
        mp: (dt:number) =>{
            if (this.inp.key['a'] != undefined) this.debug.m[0] -= dt*(this.inp.key['a'] == 0 ? 1 : this.inp.key['a']&2 ? 0.25 : 0);
            if (this.inp.key['d'] != undefined) this.debug.m[0] += dt*(this.inp.key['d'] == 0 ? 1 : this.inp.key['d']&2 ? 0.25 : 0);
            if (this.inp.key['q'] != undefined) this.debug.m[1] -= dt*(this.inp.key['q'] == 0 ? 1 : this.inp.key['q']&2 ? 0.25 : 0);
            if (this.inp.key['e'] != undefined) this.debug.m[1] += dt*(this.inp.key['e'] == 0 ? 1 : this.inp.key['e']&2 ? 0.25 : 0);
            if (this.inp.key['s'] != undefined) this.debug.m[3] -= dt*(this.inp.key['s'] == 0 ? 1 : this.inp.key['s']&2 ? 0.25 : 0);
            if (this.inp.key['w'] != undefined) this.debug.m[3] += dt*(this.inp.key['w'] == 0 ? 1 : this.inp.key['w']&2 ? 0.25 : 0);
            if (this.inp.key['x'] != undefined) this.debug.m[2] -= dt*(this.inp.key['x'] == 0 ? 1 : this.inp.key['x']&2 ? 0.25 : 0);
            if (this.inp.key['z'] != undefined) this.debug.m[2] += dt*(this.inp.key['z'] == 0 ? 1 : this.inp.key['z']&2 ? 0.25 : 0);
            if (this.inp.key['c'] != undefined) this.debug.m[4] -= dt*(this.inp.key['c'] == 0 ? 4 : this.inp.key['c']&2 ? 0.25 : 0);
            if (this.inp.key['v'] != undefined) this.debug.m[4] += dt*(this.inp.key['v'] == 0 ? 4 : this.inp.key['v']&2 ? 0.25 : 0);
            if (this.inp.key['r'] != undefined) this.debug.m[5] -= dt*(this.inp.key['r'] == 0 ? 4 : this.inp.key['r']&2 ? 0.25 : 0);
            if (this.inp.key['f'] != undefined) this.debug.m[5] += dt*(this.inp.key['f'] == 0 ? 4 : this.inp.key['f']&2 ? 0.25 : 0);
            if (this.inp.key['1'] != undefined || this.inp.key['2'] != undefined) {
                //let v = this.inp.key['1'] != undefined ? this.inp.key['1'] : this.inp.key['2'];
                let a = Math.PI/16*dt*(this.inp.key['1'] != undefined ? 1 : -1);
                let c = Math.cos(a), s = Math.sin(a);
                let m = [...this.debug.m];
                this.debug.m = [
                    m[0]*c+m[2]*s,
                    m[1]*c+m[3]*s,
                    m[2]*c-m[0]*s,
                    m[3]*c-m[1]*s,
                    m[4],
                    m[5]
                ];
            }
            if (!Object.keys(this.inp.key).length) for (let n = 0; n < 6; n++) if (this.debug.m[n] != this.debug._m[n]) {
                console.log('DEBUG MATRIX:', this.debug.m.toString());
                this.debug._m = [...this.debug.m];
                break;
            }
        }
    };

    /* RENDERING */
    private _wait:number = 0;
    private _times:DOMHighResTimeStamp[] = [];
    private _start:DOMHighResTimeStamp;
    /**
     * Frames Per Second
     */
    get fps(  ):number  { return this._times.length; }
    set fps(fps:number) { this._wait = fps ? 2000/fps : 0; }
    /**
     * Scenes of entities
     */
    scenes:Entity[][] = [];
    /**
     * Current scene, `-1` means not to render
     */
    scene:number = -1;

    /**
     * Starts the main loop
     */
    start_loop(init=true) {
        // Timing system (Delta-time, and FPS)
        let d = performance.now();
        let dt = this._times.length ? d-this._times[this._times.length-1] : 0;
        this._times = this._times.filter(t => d-t<=1000);
        this._times.push(d);
        if (init) this._start = d;

        // Main function
        let n = 0;
        if (this.scene != -1) for (const cam of this.cameras) {
            cam.clear();
            for (const entity of this.scenes[this.scene]) cam.render(...entity.render(dt/1000, d-this._start, this, cam));
            this.loop(dt/1000, d-this._start, cam);
            n++;
        }

        // Interval
        this.inp.reset();
        //for (const inp of this.ins) inp.reset();
        setTimeout(()=>this.start_loop(false), this._wait-dt > 0 ? this._wait-dt : 0);
    }
    /**
     * Customizable loop
     */
    loop:(dt:number, t:number, cam:Camera)=>void = ()=>{};
    /* MAIN */
    constructor() { this.inp = new Input(this); this.start_loop(); }
}