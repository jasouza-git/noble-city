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
 * - `ox` - Horizontal origin
 * - `oy` - Vertical origin
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
 * - `crop` - Rectangle image offset relative to "nw"
 * - `a` - Alpha opacity from 0 *(hidden)* to 1 *(visible)*, can also represent volume
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
     * Horizontal origin
     */
    ox?:number,
    /**
     * Vertical origin
     */
    oy?:number,
    /**
     * Camera coefficent from 0 *(fixed)* to 1 *(relative)*, default 1
     */
    c?:number,
    /**
     * Matrix transformation, must have 6 numbers
     */
    m?:number[],
    /**
     * The filled texture *(color/image/audio)* of the shape
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
     * Rectangle image offset relative to "nw"
     * 
     * ```
     * [x, y, w, h]
     * ```
     * - `x` - X position of crop from left
     * - `y` - Y position of crop from top
     * - `w` - Width of crop
     * - `h` - Height of crop
     * 
     * You can incorporate sprite tiling cropping
     * 
     * ```
     * [ox, oy, ow, oh, px, py, pw, ph]
     * ```
     * - `ox` - X offset multiplied by `0` for left, `0.5` for middle, and `1` for right
     * - `oy` - Y offset multiplied by `0` for top, `0.5` for middle, and `1` for bottom
     * - `ow` - Crop width for each tile
     * - `oh` - Crop height for each tile
     * - `px` - Position between each tile horizontally multiplied by X position
     * - `py` - Position between each tile vertically multiplied by Y position
     * - `pw` - Position width *(Number of horizontal tiles+1)*
     * - `ph` - Position height *(Number of vertical tiles+1)*
     */
    crop?:number[],
    /**
     * Alpha opacity from 0 *(hidden)* to 1 *(visible)*, can also represent volume
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
    data?:{[index:string]:any},
    /**
     * Sets mouse cursor
     * 
     * [Cursor reference](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)
     */
    cur?:string,
    /**
     * Sets audio
     */
    //aud?:string,
    /**
     * Audio volume from 0 *(mute)* to 1 *(full volume)*
     */
    //vol?:number,
    /**
     * Mouse clicked on it *(requires points `p`)*
     */
    click?:(s:sprite)=>void,
    /**
     * Mouse pressed on it *(requires points `p`)*
     */
    press?:(s:sprite)=>void,
    /**
     * Mouse hovered on it *(requires points `p`)*
     */
    hover?:(s:sprite)=>void,
    /**
     * Mouse did not hovered on it *(requires points `p`)*
     */
    nohover?:(s:sprite)=>void,
};
/**
 * Camera responsible for rendering the scene
 * - `x` - X Position of camera
 * - `y` - Y position of camera
 * - `w` - Width of canvas
 * - `h` - Height of canvas
 * - `sx` - Horizontal scale *(set `s` to set both)*
 * - `sy` - Vertical scale *(set `s` to set both)*
 * - `def` - Default sprite template
 * - `cursor` - Default camera cursor
 * - `render(base,...sprites)` - Renders sprite
 * - `clear()` - Clears camera
 * - `fit` - Fit to parent automatically?
 * - `fitfull()` - Fit to parent
 * - `tile(sprite)` - Titles the canvas infinitely using only one sprite
 * - `dom` - Camera canvas dom element
 */
export class Camera {
    /**
     * X Position of camera
     */
    x:number = 0;
    /**
     * Y position of camera
     */
    y:number = 0;

    sm:number = 1;
    /**
     * Width of canvas
     */
    get w():number { return Math.floor(this.dom.width/this.sm); }
    set w(v:number) { this.dom.width = v; }
    /**
     * Height of canvas
     */
    get h():number { return Math.floor(this.dom.height/this.sm); }
    set h(v:number) { this.dom.height = v; }
    /**
     * Scale of canvas
     */
    set s(v:number) {
        this.sx = v;
        this.sy = v;
    }
    /**
     * Horizontal scale *(set `s` to set both)*
     */
    sx:number = 1;
    /**
     * Vertical scale *(set `s` to set both)*
     */
    sy:number = 1;

    /**
     * Scale to resolution multiplied
     */
    scale(c:number) {
        this.dom.width *= c;
        this.dom.height *= c;
        this._ctx = this.dom.getContext('2d')!;
        this._ctx.imageSmoothingEnabled = false;
        this._ctx.scale(c, c);
        this.sm *= c;
    }
    /**
     * Fullscreen to canvas
     */
    full() {
        //this.dom.requestFullscreen();
        document.body.requestFullscreen();
    }

    /**
     * Default sprite template
     */
    def:sprite = {
        bz: 1,
    };
    /**
     * Default camera cursor
     */
    cursor:string = 'default';
    tolisten:sprite[] = [];
    /**
     * Renders sprites
     */
    render(base:sprite={}, ...sprites:sprite[]) {
        let eng = this._eng;
        if (!sprites.length) {
            sprites = [base];
            base = {};
        }
        for (const sp of sprites) {
            this._ctx.save();

            // Object
            let s:sprite = {};
            Object.assign(s, this.def, base, sp);

            // Event
            if ((s.click || s.hover || s.press) && s.p != undefined) this.tolisten.push(s);

            // Music
            if (s.f && s.f in eng.audios) {
                eng.audios[s.f].active = true;
                eng.audios[s.f].volume = s.a??1;
                continue;
            }

            // Conditions
            let cf:boolean = s.f != undefined && !(s.f in eng.imgs);        // Color fill?
            let cb:boolean = s.b != undefined && !(s.b in eng.imgs);        // Color stroke?
            let cc:boolean = s.crop != undefined && s.crop.length == 4;     // Valid rectangle
            let co:boolean = s.crop != undefined && s.crop.length >= 8;     // Valid tiling rectangle

            // Fill and Stroke
            if (cf) this._ctx.fillStyle = s.f!;
            if (cb) this._ctx.strokeStyle = s.b!;
            this._ctx.lineCap = s.be == 'arc' ? 'round' : s.be == 'sqr' ? 'square' : 'butt';
            this._ctx.lineJoin = s.bj == 'arc' ? 'round' : s.bj == 'sqr' ? 'bevel' : 'miter';
            this._ctx.lineWidth = s.bz??1;
            
            // Alpha
            if (s.a == 0) {
                this._ctx.restore();
                continue;
            }
            this._ctx.globalAlpha = s.a??1;

            // Camera
            // P\left(x,y\right)=\left[xz_{cam}^c+\frac{w}{2}cz_{cam}^{c-1}+x_{cam}(1-c-z_{cam}^c),yz_{cam}^c+\frac{h}{2}cz_{cam}^{c-1}+y_{cam}(1-c-z_{cam}^c)\right]
            //this._ctx.save();
            s.c = s.c ?? 1;
            let [csx, csy] = [Math.pow(this.sx, s.c), Math.pow(this.sy, s.c)];
            s.sx = (s.sx??s.s??1)*csx;
            s.sy = (s.sy??s.s??1)*csy;
            let [rs, rc] = s.r ? [Math.sin(s.r), Math.cos(s.r)] : [0,1];
            let [tx, ty] = [this.w/2*s.c*Math.pow(this.sx, s.c-1)+this.x*(1-s.c-csx)+(s.x??0)*csx, this.h/2*s.c*Math.pow(this.sy, s.c-1)+this.y*(1-s.c-csy)+(s.y??0)*csy];
            let rect = this.rect(s);
            this._ctx.transform(s.sx*rc,s.sx*rs,-s.sy*rs, s.sy*rc, tx, ty);
            if (s.m && s.m.length == 6) this._ctx.transform.apply(this._ctx, s.m);
            else if (s.m) eng.error_add(new Error(`Invalid transform [${s.m.toString()}]`))
            this._ctx.translate(rect[0][0]/s.sx, rect[0][1]/s.sy);
            
            // Image rendering off camera optimization
            if (s.f && !cf) {
                // width, height
                let p = s.crop && cc ? [s.crop[2], s.crop[3]] :
                        s.crop && co ? [s.crop[4]*(s.crop[6]+1), s.crop[5]*(s.crop[7]+1)] :
                        [this._eng.imgs[s.f].width, this._eng.imgs[s.f].height];
                p = [Math.abs(p[0]*s.sx*rc), Math.abs(p[1]*s.sy*rc)];
                if (this.w+p[0] < tx || this.h+p[1] < ty || tx+p[0] < 0 || ty+p[1] < 0) {
                    this._ctx.restore();
                    continue;
                }
            }

            // Image
            if (s.f != undefined && s.f in eng.imgs) {
                if (s.crop && cc)           this._ctx.drawImage(eng.imgs[s.f], s.crop[0], s.crop[1], s.crop[2], s.crop[3], 0, 0, s.crop[2], s.crop[3]);
                else if (s.crop && co) {
                    let w = s.crop[2]*(s.crop[6]%1||1);
                    let cw = s.crop[4]*(s.crop[6]%1||1);
                    let h = s.crop[3]*(s.crop[7]%1||1);
                    let ch = s.crop[5]*(s.crop[6]%1||1);
                    let mw = Math.ceil(s.crop[6]), mh = Math.ceil(s.crop[7]);
                    for (let x = 0; x <= mw; x++) for (let y = 0; y <= mh; y++)
                        this._ctx.drawImage(
                            eng.imgs[s.f],
                            (s.crop[0]+s.crop[2]-w)*(x==0?0:x==mw?1:0.5)+(s.crop[8]??0),
                            (s.crop[1]+s.crop[3]-h)*(y==0?0:y==mh?1:0.5)+(s.crop[9]??0),
                            w,
                            h,
                            cw*x,
                            ch*y,
                            w,
                            h
                        );
                } else                      this._ctx.drawImage(eng.imgs[s.f], 0, 0);
                s.p = s.p ?? rect;
            }

            // Position without scalling
            //this._ctx.restore();
            //this._ctx.transform(csx*rc,csx*rs,-csy*rs,csy*rc,tx,ty);
            
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
                if (cb) this._ctx.stroke();
                if (cf && (s.bz??1)) this._ctx.fill();
            }

            // Text
            if (s.t) {
                let height = s.tz??20;
                let [px,py] = [0,0];
                let [cx,cy] = [false,false];
                this._ctx.font = `${height}px ${s.tf && s.tf in eng.fonts ? eng.fonts[s.tf] : s.tf ?? 'Arial'}`;
                
                if (cx=[0,0.5,1].includes(s.ox!)) this._ctx.textAlign = s.ox == 0 ? 'start' : s.ox == 1 ? 'end' : 'center';
                if (cy=[0,0.5,1].includes(s.oy!)) this._ctx.textBaseline = s.oy == 0 ? 'top' : s.oy == 1 ? 'bottom' : 'middle';
                if (!cx) px = -this._ctx.measureText(s.t).width*s.ox!;
                if (!cy) py = -height*s.oy!;
                
                if (cb && (s.bz??1)) this._ctx.strokeText(s.t, px, py);
                if (!cf) this._ctx.fillStyle = '#000';
                if (!cf && !cb || cf) this._ctx.fillText(s.t, px, py);
            }

            // Restore
            this._ctx.restore();
        }
    }
    /**
     * Seperate audio instance play
     */
    play(audio:string, vol:number=1, start:number=0):boolean {
        if (audio in this._eng.audios) {
            let a:HTMLMediaElement|null = new Audio();
            a.src = this._eng.base+audio;
            a.volume = vol;
            a.currentTime = start;
            a.addEventListener('ended', ()=>a = null);
            a.play();
            return true;
        }
        return false;
    }
    /**
     * Clears scene
     */
    clear() {
        this._ctx.clearRect(0, 0, this.w, this.h);
    }

    /**
     * Fit to parent automatically?
     */
    fit = false;
    /**
     * Fit to parent
     */
    fitfull() {
        let {width, height} = (this.dom.parentElement||this.dom).getBoundingClientRect();
        let rw = this.w/this.h;
        let rs = width/height;
        if (rs > rw) {
            this.dom.style.width = 'auto';
            this.dom.style.height = '100%';
        } else {
            this.dom.style.width = '100%';
            this.dom.style.height = 'auto';
        }
    }

    /**
     * Titles the canvas infinitely using only one sprite
     */
    tile(s:sprite):void {
        let sx = s.sx != undefined ? s.sx : s.s != undefined ? s.s : this.def.sx != undefined ? this.def.sx : this.def.s != undefined ? this.def.s : 1;
        let sy = s.sy != undefined ? s.sy : s.s != undefined ? s.s : this.def.sy != undefined ? this.def.sy : this.def.s != undefined ? this.def.s : 1;
        let bcr = this.dom.getBoundingClientRect()
        let rx = bcr.width/this.w;
        let ry = bcr.height/this.h;
        let ax = this.w/innerWidth;
        if (!s.f || !(s.f in this._eng.imgs)) {
            if(s.f != undefined) this.dom.style.background = s.f;
        } else {
            // Set preload so that it doesnt glitches during switching
            if (!this._tile_pic.includes(s.f)) {
                let a = document.createElement('link');
                a.setAttribute('rel', 'preload');
                a.setAttribute('href', `${this._eng.base}${s.f}`);
                a.setAttribute('as', 'image');
                document.body.appendChild(a);
            }
            // Set background
            this.dom.style.backgroundImage = `url(${this._eng.base}${s.f})`;
            this.dom.style.backgroundPosition = `calc(50% + ${((s.x||0)-this.x)*this.sx*rx}px) calc(50% + ${((s.y||0)-this.y)*this.sy*ry}px)`;
            this.dom.style.backgroundSize = `${this._eng.imgs[s.f].width*this.sx*sx/ax}px ${this._eng.imgs[s.f].height*this.sy*sy/ax}px`;
        }
    }
    private _tile_pic:string[] = [];
    /**
     * Returns suppose to be `s.p` if not provided *(will derive from image)*
     */
    rect(s:sprite):number[][] {
        // Conditions
        let cf:boolean = s.f != undefined && !(s.f in this._eng.imgs); // Color fill?
        let cc:boolean = s.crop != undefined && s.crop.length == 4;     // Valid rectangle
        let co:boolean = s.crop != undefined && s.crop.length >= 8;     // Valid tiling rectangle
        
        // Converting cardinal direction `s.o` into ratio origins `s.ox` and `s.oy`
        s.ox =  s.ox ?? (
            !s.o || !s.o.includes('w') && !s.o.includes('e') ? 0.5 :
            s.o && s.o.includes('e') ? 1 : 0);
        s.oy =  s.oy ?? (
            !s.o || !s.o.includes('n') && !s.o.includes('s') ? 0.5 :
            s.o && s.o.includes('s') ? 1 : 0);

        // Shape dimensions
        let d = s.crop && cc ? [s.crop[2], s.crop[3]] :
                s.crop && co ? [s.crop[4]*(s.crop[6]+1)-(s.crop[8]??0), s.crop[5]*(s.crop[7]+1)-(s.crop[9]??0)] :
                s.f && !cf   ? [this._eng.imgs[s.f].width, this._eng.imgs[s.f].height] :
                [0, 0];
        
        return [[
            // X Position
            d[0]*-(s.ox??0.5)*(s.sx??s.s??1),
            // Y Position
            d[1]*-(s.oy??0.5)*(s.sy??s.s??1),
            ],[],[
            // Width
            d[0]*(s.sx??s.s??1),
            // Height
            d[1]*(s.sy??s.s??1),
        ],[]];
    }

    /**
     * Camera DOM Element (Canvas)
     */
    dom:HTMLCanvasElement;
    /* MAIN */
    scene:Scene|null = null;
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
 * - `g*` - Gets the changed value since mouse down *(dragged)*
 * - `cb(n,x)` - Returns true if boolean at `n` is `x` for button `b`
 * 
 * **Keyboard**
 * - `key` - Dictionary of currently pressed key and what its pressed with in a bit field
 *   1. CTRL Key
 *   2. Shift Key
 *   3. Alt Key
 * 
 * **Shortcuts**
 * - `d*` - Gets the changed value since last frame *(delta)*
 * - `click(treshold)` - Checks if the user clicked the mouse *(after mouse up)*
 * - `over(poly,pos,c)` - Checks if the mouse is over a polygon
 * - `in(...rects)` - Checks if the mouse is over some rectangles *(use `rin` for relative rectangles)*
 * 
 * **Methods**
 * - `handle(event)` - Deals with events
 * - `bind(dom)` - Binds a camera to
 * - `reset()` - Resets delta changes
 */
export class Input {
    /* ----- MOUSE ----- */
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
        let rx = (this.x-this._cam.w/2*c+this._cam.x*c*this._cam.sx)*Math.pow(this._cam.sx, -c)-pos[0];
        let ry = (this.y-this._cam.h/2*c+this._cam.y*c*this._cam.sy)*Math.pow(this._cam.sy, -c)-pos[1];
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
     * Dictionary of currently pressed key and what its pressed with in a bit field
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
 * - `res` - Resources to be loaded before the entity can be used
 * - `depend` - Other entities to be loaded before the main entity can be used
 * - `render(dt,t,cam)` - Renders an entity
 * - `eng` - Engine it is currently on
 */
export class Entity {
    /**
     * Resources to be loaded before the entity can be used
     */
    static res:string[] = [];
    /**
     * Other entities to be loaded before the main entity can be used
     */
    static depend:typeof Entity[] = [];

    /**
     * Renders the entity, the first entity represents the base entity
     * @param dt {number} Delta-time in seconds
     * @param t {number} Total time passed since start in miliseconds
     * @param cam {Camera} The camera being rendered to
     * @returns {sprite[]} Sprites to render
     */
    render(dt:number, t:number, cam:Camera, ...x:any[]):sprite[] {
        return [];
    }

    /* MAIN */
    /**
     * Game engine it is loaded into
     */
    eng:Engine|null = null;
    /**
     * Scene it is loaded into
     */
    scene:Scene|null = null;
    constructor(...x:any[]) {}
}
/**
 * Scene of entities
 * - `entities` - Entities at the scene
 * - `add(...x)` - Adds entities into the scene
 * - `remove(...x)` - Removes enitities from the scene
 * - `show(cam)` - Shows scene to camera, blank for first camera
 */
export class Scene {
    /**
     * Entities at the scene
     */
    entities:Entity[] = [];
    /**
     * Adds entities
     */
    add(...entities:Entity[]) {
        for (const entity of entities) {
            entity.eng = this.eng;
            this.entities.push(entity);
        }
    }
    /*private add_sub(...entities:Entity[]) {
        for (const entity of entities) {
            entity.eng = this.eng;
        }
    }
    /**
     * Removes entities
     */
    remove(...entities:Entity[]) {
        for (let n = 0; n < this.entities.length; n++) {
            if (entities.includes(this.entities[n])) {
                this.entities.slice(n,1);
                n--;
            }
        }
    }
    /**
     * Shows the scene
     */
    show(cam?:Camera) { // TODO! allow transition scenes
        if (cam) cam.scene = this;
        else if (this.eng.cameras.length) this.eng.cameras[0].scene = this;
    }
    /**
     * Engine
     */
    eng:Engine;
    constructor(eng:Engine, ...entities:Entity[]) {
        this.eng = eng;
        this.add(...entities);
    }
}
/**
 * Engine responsible for processing the whole game and its components
 * 
 * **Caches**
 * - `imgs` - Images
 * - `fonts` - Fonts
 * - `audios` - Audios
 * 
 * **Loading**
 * - `base` - Base directory where all resources will be loaded from
 * - `load` - Loads entities' resources so they can be rendered
 * - `load_res` - Loads resources into cache
 * 
 * **Errors**
 * - `errors` - Engine errors
 * - `load_err` - Loading Errors *(files that failed to load)*
 * - `error_add` - Reports an error if not a duplicate error
 * 
 * **Components**
 * - `cameras` - All cameras
 * - `input` - Hardware inputs
 * 
 * **Debugging**
 * - `mp` - Control system to play around with the `sprite.m` values
 * - `m` - Resulting `sprite.m` array
 * 
 * **Rendering**
 * - `fps` - Current rendering fps, set value to set limit
 * - `scenes` - Engine game scenes
 * - `scene` - Current scene it is rendering
 * - `start_loop` - Starts main loop *(automatic in constructor)*
 * 
 * **Customized**
 * - `loop` - Function that runs every frame
 * - `act` - Function triggered by entity actions *(acts has the API between entities)*
 */
export class Engine {
    /* ----- CACHES ----- */
    /**
     * Images cache
     */
    imgs:{[index:string]:HTMLImageElement} = {};
    /**
     * Font cache
     */
    fonts:{[index:string]:string} = {};
    /**
     * Audio cache
     */
    audios:{[index:string]:HTMLAudioElement&{active?:boolean}} = {};

    /* ----- LOADING SYSTEM ----- */
    /**
     * Base directory where all resources will be loaded from, in this syntax:
     * 
     * `{base}{file}`
     */
    base:string = '';
    /**
     * Loads entities' resources so they can be rendered
     * @param state Function to call for each loaded update
     * @param entities Entities to load
     */
    load(state:((percent:number)=>void)|null, ...entities:typeof Entity[]):string[] {
        let toload:string[] = [];
        for (const entity of entities) {
            toload.push(...entity.res);
            if (entity.depend.length)
                toload.push(...this.load(null, ...entity.depend))
        }
        if (state != null) this.load_res(state, ...toload);
        return toload;
    }
    /**
     * Loads resources into cache
     * @param state Function to call for each loaded update
     * @param files Files to load
     */
    load_res(state:(percent:number)=>void, ...files:string[]):void {
        let loads:number[][] = []; // (loaded, toload)
        let failed = false;
        // Update loaded progress
        let update = (val:number, num:number) => {
            if (val == -1) {
                this.load_err.push(this.base+files[num]);
                failed = true;
            }
            loads[num][0] = val;
            state(failed ? -1 : loads.map(x=>x[0]/x[1]).reduce((a,b)=>a+b)/loads.length);
        };

        let n = 0;
        for (const file of files) {
            // Check if file is already loaded into cache
            if (file in this.imgs || file in this.fonts || file in this.audios) {
                loads.push([0,1]);
                update(1, n);
                n++;
                continue;
            }
            // Check file format to load into cache
            let ext = file.split('.').reverse()[0].toLowerCase();
            if (['png','jpg','jpeg'].includes(ext)) {
                loads.push([0,1]);
                let img = new Image();
                let k = n;
                img.onload = () => update(1,k);
                img.onerror = () => update(-1,k);
                img.src = this.base+file;
                this.imgs[file] = img;
            } else if (['mp3','wav'].includes(ext)) {
                loads.push([0,1]);
                this.audios[file] = new Audio();
                let k = n;
                let a = this.audios[file];
                a.active = false;
                a.oncanplaythrough  = () => update(1,k);
                a.onerror = () => update(-1,k);
                a.src = this.base+file;
                a.volume = 0;
                a.addEventListener('ended', ()=>{
                    a.currentTime = 0;
                    a.play();
                });
                a.load();
            } else if (['ttf','mp3','wav'].includes(ext)) {
                loads.push([0,5]);
                let k = n;
                let h = new XMLHttpRequest();
                h.open('GET', this.base+file);
                h.responseType = 'blob';
                h.onreadystatechange = () => {
                    // Loaded amount
                    update(h.readyState, k);
                    // Failed to load file
                    if (h.readyState == 4 && h.status != 200) return update(-1,k);
                    // Not finished, continue
                    if (h.readyState != 4 || h.status != 200) return;
                    // Font loaded
                    if (ext == 'ttf') {
                        let n = this.fonts[file] = `font_${Object.keys(this.fonts).length}`;
                        // Force font render
                        let d:HTMLHeadElement = document.createElement('h1');
                        d.style.font = `20px ${n}`;
                        d.innerHTML = n;
                        d.style.position = 'fixed';
                        d.style.left = '0';
                        d.style.top = '100%';
                        // Load font into font family
                        let s:HTMLStyleElement = document.createElement('style');
                        s.innerHTML += `@font-face {font-family:"${n}";src:url("${URL.createObjectURL(h.response)}") format("truetype");}`;
                        document.head.appendChild(s);
                        document.body.appendChild(d);
                        // Wait for body to render it
                        let check = (a:number) => {
                            // Check if page loaded font
                            if (document.fonts.check(`20px ${n}`)) update(5,k);
                            // Too many failed attempts
                            else if (a > 1000) update(-1,k);
                            // Wait again later
                            else setTimeout(check, 10, a+1);
                        };
                        check(0);
                    } if (['mp3','wav'].includes(ext)) {
                        this.audios[file] = new Audio();
                        let a = this.audios[file];
                        a.active = false;
                        a.src = URL.createObjectURL(h.response);
                        a.volume = 0;
                        a.addEventListener('ended', ()=>{
                            a.currentTime = 0;
                            a.play();
                        });
                        update(5, k);
                    } else update(5, k);
                };
                h.send();
            } else {
                // Unknown file type
                loads.push([0,1]);
                this.error_add(new Error(`Unknown file type "${ext}"`))
                update(-1,n);
            }
            n++;
        }
        if (!failed) state(0);
    };

    /* ----- ERROR SYSTEM ----- */
    /**
     * Engine Errors
     */
    errors:Error[] = [];
    /**
     * Loading Errors *(files that failed to load)*
     */
    load_err:string[] = [];
    /**
     * Reports an error if not a duplicate error
     * @param err Error that occured
     */
    error_add(err:Error):void {
        for (const e of this.errors) if(e.message == err.message) return;
        this.errors.push(err);
        console.log(err);
    }

    /* ----- COMPONENT SYSTEM ----- */
    /**
     * Cameras
     */
    cameras:Camera[] = [];
    /**
     * Engine Input
     */
    inp:Input;

    /* ----- DEBUGING SYSTEM ----- */
    /**
     * Tools useful for debugging
     * 
     * Note: must not be included in final version
     */
    debug:{
        m:number[],
        _m:number[],
        mp:(dt:number)=>void,
        v:number,
        vp:(dt:number)=>void,
        p:number[][],
        pn:number,
        pp:(dt:number)=>void,
    } = {
        /**
         * Matrix tranform
         */
        m: [1,0,0,1,0,0],
        _m: [1,0,0,1,0,0],
        /**
         * Matrix play
         * @param dt {number} Delta-time
         */
        mp: (dt:number):void => {
            if (this.inp.key['a'] != undefined) this.debug.m[0] -= dt*(this.inp.key['a'] == 0 ? 1 : this.inp.key['a']&2 ? 0.25 : 0);
            if (this.inp.key['d'] != undefined) this.debug.m[0] += dt*(this.inp.key['d'] == 0 ? 1 : this.inp.key['d']&2 ? 0.25 : 0);
            if (this.inp.key['q'] != undefined) this.debug.m[1] -= dt*(this.inp.key['q'] == 0 ? 1 : this.inp.key['q']&2 ? 0.25 : 0);
            if (this.inp.key['e'] != undefined) this.debug.m[1] += dt*(this.inp.key['e'] == 0 ? 1 : this.inp.key['e']&2 ? 0.25 : 0);
            if (this.inp.key['x'] != undefined) this.debug.m[2] -= dt*(this.inp.key['x'] == 0 ? 1 : this.inp.key['x']&2 ? 0.25 : 0);
            if (this.inp.key['z'] != undefined) this.debug.m[2] += dt*(this.inp.key['z'] == 0 ? 1 : this.inp.key['z']&2 ? 0.25 : 0);
            if (this.inp.key['s'] != undefined) this.debug.m[3] -= dt*(this.inp.key['s'] == 0 ? 1 : this.inp.key['s']&2 ? 0.25 : 0);
            if (this.inp.key['w'] != undefined) this.debug.m[3] += dt*(this.inp.key['w'] == 0 ? 1 : this.inp.key['w']&2 ? 0.25 : 0);
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
        },
        /**
         * Value
         */
        v: 1,
        /**
         * Value Player
         */
        vp: (dt:number):void => {
            if (this.inp.key['a'] != undefined) this.debug.v -= dt*(this.inp.key['a'] == 0 ? 1 : this.inp.key['a']&2 ? 0.25 : 0);
            if (this.inp.key['d'] != undefined) this.debug.v += dt*(this.inp.key['d'] == 0 ? 1 : this.inp.key['d']&2 ? 0.25 : 0);
            console.log(this.debug.v);
        },
        p:[],
        pn:-1,
        pp: (dt:number):void => {
            if (this.debug.pn == -1) return;
            if (this.inp.dkey['q'] == 0) this.debug.pn = (this.debug.pn-1)%this.debug.p.length;
            if (this.inp.dkey['e'] == 0) this.debug.pn = (this.debug.pn+1)%this.debug.p.length;
            if (this.inp.key['a'] != undefined) this.debug.p[this.debug.pn][0] -= dt*(this.inp.key['a'] == 0 ? 20 : this.inp.key['a']&2 ? 5 : 0);
            if (this.inp.key['d'] != undefined) this.debug.p[this.debug.pn][0] += dt*(this.inp.key['d'] == 0 ? 20 : this.inp.key['d']&2 ? 5 : 0);
            if (this.inp.key['w'] != undefined) this.debug.p[this.debug.pn][1] -= dt*(this.inp.key['w'] == 0 ? 20 : this.inp.key['w']&2 ? 5 : 0);
            if (this.inp.key['s'] != undefined) this.debug.p[this.debug.pn][1] += dt*(this.inp.key['s'] == 0 ? 20 : this.inp.key['s']&2 ? 5 : 0);
            if (this.inp.dkey['r'] == 0) {
                this.debug.p.push([...this.debug.p[this.debug.p.length-1]]);
                this.debug.pn = this.debug.p.length-1;
            }
            if (this.inp.dkey['f'] == 0) {
                this.debug.p = this.debug.p.map(x=>x.map(y=>Math.round(y)));
                console.log(JSON.stringify(this.debug.p));
            }
        }
    };

    /* ----- RENDERING SYSTEM ----- */
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
    scene:Scene|null = null;
    /**
     * Starts the main loop `Engine.loop`
     */
    start_loop(init=true) {
        // Timing system (Delta-time, and FPS)
        let d = performance.now();
        let dt = this._times.length ? d-this._times[this._times.length-1] : 0;
        this._times = this._times.filter(t => d-t<=1000);
        this._times.push(d);
        if (init) this._start = d;

        // Restart state of audio
        for (const aud in this.audios) this.audios[aud].active = false;

        // Main function
        let n = 0;
        for (const cam of this.cameras) {
            // Camera
            cam.cursor = 'default';
            cam.clear();
            if (cam.fit) cam.fitfull();
            cam.tolisten = [];
            // Entities
            let sprites:sprite[] = [];
            if (cam.scene != null) for (const entity of cam.scene.entities) {
                let ss = merge(entity.render(dt/1000, d-this._start, cam));
                for (const s of ss) sprites.push(s)
            }
            // Listen to events
            let clicks = 0;
            let hovers = 0;
            for (let n = sprites.length-1; n >= 0; n--) {
                let s = sprites[n];
                if (!s.hover && !s.press && !s.click && !s.nohover) continue;
                if (s.p == undefined) s.p = cam.rect(s);
                let h = false;
                if (this.inp.over(s.p, [s.x??0,s.y??0], s.c??1)) {
                    if (hovers == 0 && s.hover) {
                        s.hover(s);
                        //hovers++;
                        h = true;
                    }
                    if (clicks == 0 && s.click && this.inp.click()) {
                        s.click(s);
                        clicks++;
                    }
                    if (s.press && this.inp.b&1 && this.inp.g < 1) s.press(s);
                }
                if (!h && s.nohover) s.nohover(s);
            }
            cam.render({}, ...sprites);
            cam.dom.style.cursor = cam.cursor;
            this.loop(dt/1000, d-this._start, cam);
            n++;
        }

        // Pause/play audio depending on activity
        for (const aud in this.audios) {
            let a = this.audios[aud];
            if (a.active && a.paused) a.play();
            else if (!a.active && !a.paused) {
                a.currentTime = 0;
                a.pause();
            }
        }

        // Interval
        this.inp.reset();
        setTimeout(()=>this.start_loop(false), this._wait-dt > 0 ? this._wait-dt : 0);
    }

    /* ----- CUSTOMIZABLE SYSTEM ----- */
    /**
     * Customizable loop
     */
    loop:(dt:number, t:number, cam:Camera)=>void = ()=>{};

    /* MAIN */
    constructor() {
        this.inp = new Input(this);
        this.start_loop();
    }
}
/* ----- ALGORITHMS ----- */
/**
 * Merges the sprites with the base sprite
 * @param arr - Array of sprites where the first array is the base sprite
 */
export function merge(arr:sprite[]):sprite[] {
    if (!arr.length) return arr;
    let [base, ...sprites] = arr;
    let r:sprite[] = [];
    for (const sprite of sprites) r.push({...base, ...sprite});
    return r;
}
/**
 * Implements a tiles to the `m` map, from the NW direction to SE
 * @param tiles - 4 bit bitfield representing possible sprites to use based on 4 corners
 * @param m - current map at `x_y`
 * @param x - X position of tile
 * @param y - Y position of tile
 * @param w - Width of tiles
 * @param h - Hieght of tiles
 */
export function tile(tiles:sprite[], m:{[index:string]:sprite}, x:number=0, y:number=0, w:number=1, h:number=1, prop:string='p') {
    let t = (p:number, X:number, Y:number):void => {
        let n = `${x+X}_${y+Y}`;
        let c = 0;
        if (m[n] && m[n].data && m[n].data[prop]) c = m[n].data[prop]; 
        let r = structuredClone(tiles[c|p]);
        if (!r.f) r.f = 'tile/test.png';
        r.data = {...(m[n]?.data||{}),...(tiles[c|p]?.data||{})};
        r.data[prop] = c|p;
        m[n] = r;
    };
    // Inside 0b1111
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
