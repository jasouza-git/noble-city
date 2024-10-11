/**
 * ### Sprite Object
 * A simple data-structure to represent renderable objects
 * #### Position
 * - `x` - X Position of sprite, default 0
 * - `y` - Y Position of sprite, default 0
 * - `z` - Z scale factor, default 1
 * - `d` - Direction string containing "nsew" or blank for center, default ""
 * - `c` - Camera coefficent from 0 *(fixed)* to 1 *(relative)*, default 1
 * #### Rendering
 * The below has no defaults, if empty then not applied
 * - `f` - The filled texture *(color/image)* of the shape
 * - `s` - The stroke texture *(color/image)* of the shape
 * - `r` - Rectangle relative to origin
 * - `p` - Path relative to origin
 * - `o` - Rectangle image offset relative to "ne"
 */
export interface sprite {
    /**
     * X Position of sprite, default `0`
     */
    x?:number,
    /**
     * Y Position of sprite, default `0`
     */
    y?:number,
    /**
     * Z scale factor, default `1`
     */
    z?:number,
    /**
     * Direction string containing "nsew" or blank for center, default `""`
     */
    d?:''|'n'|'e'|'w'|'s'|'ne'|'nw'|'se'|'sw',
    /**
     * Camera coefficent from 0 *(fixed)* to 1 *(relative)*, default `1`
     */
    c?:number,
    /**
     * The filled texture *(color/image)* of the shape
     */
    f?:string,
    /**
     * The stroke texture *(color/image)* of the shape
     */
    s?:string,
    /**
     * The stroke width, default `1`
     */
    w?:number,
    /**
     * Rectangle relative to origin
     */
    r?:number[],
    /**
     * Path relative to origin
     */
    p?:number[][],
    /**
     * Rectangle image offset relative to "ne"
     */
    o?:number[],
    /**
     * Text content
     */
    t?:string,
    /**
     * Font Style
     */
    n?:string,
    /**
     * Alpha from 0 to 1, default `0`
     */
    a?:number,
}
/**
 * ### Mouse
 * The current mouse status
 * - `x` - X position relative to canvas, relative to its dimensions
 * - `y` - Y position relative to canvas, relative to its dimensions
 * - `b` - Button being pressed (bits 1-3)
 * - `sx` - Scrolled X distance
 * - `sy` - Scrolled Y distance
 * - `rx` - X position relative to camera
 * - `ry` - Y position relative to camera
 * 
 * Note! just add `d` to the front to get the delta difference/change
 * Or for `b` use `ab(n)` to check if mouse is clicked and what button
 * 
 * Methods:
 * - `handle(event)` - Handles event to apply to mouse
 * - `listen(dom)` - Adds eventlistener to `dom`
 */
export class Mouse {
    x:number = 0;   private _x:number = 0;
    y:number = 0;   private _y:number = 0;
    b:number = 0;   private _b:number = 0;
    sx:number = 0;  private _sx:number = 0;
    sy:number = 0;  private _sy:number = 0;
    rx:number = 0;  private _rx:number = 0;
    ry:number = 0;  private _ry:number = 0;
    dragxy:number[] = [0,0];
    set dx(v:number)    { this._x = this.x -v; }
    set dy(v:number)    { this._y = this.y -v; }
    set db(v:number)    { this._b = this.b ^v; } //?
    set dsx(v:number)   { this._sx= this.sx-v; }
    set dsy(v:number)   { this._sy= this.sy-v; }
    set drx(v:number)   { this._rx= this.rx-v; }
    set dry(v:number)   { this._ry= this.ry-v; }
    get dx():number     { if (this.x  == this._x ) return 0; let d = this.x -this._x ; /*this._x = this.x ;*/ return d; }
    get dy():number     { if (this.y  == this._y ) return 0; let d = this.y -this._y ; /*this._y = this.y ;*/ return d; }
    get db():number     { if (this.b  == this._b ) return 0; let d = this.b ^this._b ; /*this._b = this.b ;*/ return d; }
    get dsx():number    { if (this.sx == this._sx) return 0; let d = this.sx-this._sx; /*this._sx= this.sx;*/ return d; }
    get dsy():number    { if (this.sy == this._sy) return 0; let d = this.sy-this._sy; /*this._sy= this.sy;*/ return d; }
    get drx():number    { if (this.rx == this._rx) return 0; let d = this.rx-this._rx; /*this._rx= this.rx;*/ return d; }
    get dry():number    { if (this.ry == this._ry) return 0; let d = this.ry-this._ry; /*this._ry= this.ry;*/ return d; }
    
    ab(n:number, x:number|null=null):boolean { return (this.db&n) != 0 && (this.b&n) == (x == null ? n : x); }
    over(r:number[]):boolean { return this.x > r[0] && this.x < r[0]+r[2] && this.y > r[1] && this.y < r[1]+r[3]; }
    rover(r:number[]):boolean { return this.rx > r[0] && this.rx < r[0]+r[2] && this.ry > r[1] && this.ry < r[1]+r[3]; }

    private _game:Game;
    constructor (game:Game) {
        this._game = game;
    }
    reset() {
        this.dx = 0;
        this.dy = 0;
        this.db = 0;
        this.dsx = 0;
        this.dsy = 0;
        this.drx = 0;
        this.dry = 0;
    }
    handle(e:MouseEvent|WheelEvent) {
        if (e instanceof WheelEvent) {
            this.sx += e.deltaX;
            this.sy += e.deltaY;
        } else if (e instanceof MouseEvent){
            const r = this._game.dom.getBoundingClientRect();
            const i = this._game.w/this._game.h;
            const d = i > r.width/r.height ? [r.width, r.width/i] : [r.height*i, r.height];
            this.x = (e.clientX-r.left-(r.width-d[0])/2)/d[0]*this._game.w;
            this.y = (e.clientY-r.top-(r.height-d[1])/2)/d[1]*this._game.h;
            this.rx = (this.x-this._game.w/2+this._game.camera.x)/this._game.camera.z;
            this.ry = (this.y-this._game.h/2+this._game.camera.y)/this._game.camera.z;
            /*if (!(this.b&1) && e.buttons&1) {
                this._gx = 
            }*/
            this.b = e.buttons;
            e.preventDefault();
        }
    }
    listen(dom:Window) {
        dom.addEventListener('wheel',       e=>this.handle(e));
        dom.addEventListener('mousemove',   e=>this.handle(e));
        dom.addEventListener('mouseover',   e=>this.handle(e));
        dom.addEventListener('mousedown',   e=>this.handle(e));
        dom.addEventListener('mouseup',     e=>this.handle(e));
        dom.addEventListener('mouseenter',  e=>this.handle(e));
        dom.addEventListener('mouseout',    e=>this.handle(e));
    }
}
export class Entity {
    /**
     * Sprites of the object
     */
    sprites:sprite[] = [];
    /**
     * Resources to load before using the asset
     */
    static res:string[] = [];
    constructor(...x:any[]) { }
    /*update(...obj:sprite[]) {
        if (this.obj.length) for (const o of obj) Object.assign(this.obj[0], o);
    }*/
    render(game:Game, dt:number, t:number):sprite[] {
        return this.sprites;
    }
}
/**
 * ### Main Game Class
 * This is responsible for managing all crucial game mechanics like
 * - Rendering system
 * - Camera System
 * - DOM System
 */
export class Game {
    dom:HTMLCanvasElement;
    x:CanvasRenderingContext2D;
    /**
     * ### Camera to render sprites relative to
     * - `x` - X Position
     * - `y` - Y Position
     * - `z` - Camera zoom
     */
    camera:{x:number,y:number,z:number} = {x:0, y:0, z:1};
    /* ----- SCREEN DIMENSIONS ----- */
    private _w:number;
    private _h:number;
    private _z:number = 1;
    get w():number { return this._w; }
    set w(v:number) {
        this._w = v;
        this.dom.setAttribute('width', String(v*this._z));
    }
    get h():number { return this._h; }
    set h(v:number) {
        this._h = v;
        this.dom.setAttribute('height', String(v*this._z));
    }
    get z():number { return this._z; }
    set z(v:number) {
        this.x.scale(v/this._z, v/this._z);
        this.dom.setAttribute('width', String(this._w*v));
        this.dom.setAttribute('height', String(this._h*v));
        this._z = v;
    }
    /* ----- LOADING ----- */
    imgs:{[index:string]:HTMLImageElement} = {};
    /**
     * ### Loads images into `this.imgs`
     * - `state` - Loading status updated
     *   - `loaded` - No. of Loaded images *(-1 if failed)*
     *   - `toload` - No. of Total images *(always contant)*
     * - `files` - Files(images) to load
     */
    load_img(state:(loaded:number,toload:number)=>void, ...files:string[]) {
        let loaded = 0;
        state(0, files.length);
        for (const file of files) {
            let img = new Image();
            img.onload = () => state(loaded == -1 ? -1 : ++loaded, files.length);
            img.onerror = () => {
                loaded = -1;
                state(-1, files.length);
            };
            img.src = file;
            this.imgs[file] = img;
        }
    };
    /* ----- DRAWING ----- */
    /**
     * ### Renders a rectangle to the canvas
     */
    rect(color:string, x:number, y:number, w:number, h:number) {
        this.x.fillStyle = color;
        this.x.fillRect(x, y, w, h);
    }
    /**
     * ### Renders an image to the canvas
     */
    img(img:string, x:number, y:number) {
        this.x.drawImage(this.imgs[img], x, y);
    }
    /**
     * ### Renders the `sprite` interface to the canvas
     * For more details checkout the `sprite` interface at `./engine.ts`
     */
    sprite(s:sprite) {
        this.x.save();
        // Conditions
        let cf:boolean = s.f != undefined && !(s.f in this.imgs); // Color fill?
        let cs:boolean = s.s != undefined && !(s.s in this.imgs); // Color stroke?
        let co:boolean = s.o != undefined && s.o.length == 4;     // Valid rectangle
        // Fill
        if (cf) this.x.fillStyle = s.f as string;
        // Stroke
        if (cs) this.x.strokeStyle = s.s as string;
        this.x.lineWidth = s.w != undefined ? s.w : 1;
        // Alpha
        if (s.a != undefined) this.x.globalAlpha = s.a;
        // Camera
        // P\left(x,y\right)=\left[xz_{cam}^c+\frac{w}{2}cz_{cam}^{c-1}+x_{cam}(1-c-z_{cam}^c),yz_{cam}^c+\frac{h}{2}cz_{cam}^{c-1}+y_{cam}(1-c-z_{cam}^c)\right]
        if (s.c != 0) {
            let c = s.c == undefined ? 1 : 0;
            let z = Math.pow(this.camera.z, c);
            this.x.transform(z, 0, 0, z, this.w/2*c*Math.pow(this.camera.z, c-1)+this.camera.x*(1-c-z),
                                         this.h/2*c*Math.pow(this.camera.z, c-1)+this.camera.y*(1-c-z));
        }
        /*if (s.c != undefined && s.c != 1) { 
            let c = 1-s.c;
            let z = Math.pow(this.camera.z, -c); // z^(c-1)
            // this.x.transform(this.camera.z, 0, 0, this.camera.z, this.w/2-this.camera.x*this.camera.z, this.h/2-this.camera.y*this.camera.z);
            this.x.transform(z, 0, 0, z, this.camera.x*c-this.w/2*c*z, this.camera.y*c-this.h/2*c*z);
        }*/
        // Origin
        this.x.textAlign = 'left';
        this.x.textBaseline = 'top';
        if (!s.d || !s.d.includes('w') && !s.d.includes('e')) { // Horizontal centering
            if (s.o && co) this.x.translate(-s.o[2]/2, 0);
            else if(s.f && !cf) this.x.translate(-this.imgs[s.f].width/2, 0);
            this.x.textAlign = 'center';
        }
        if (!s.d || !s.d.includes('n') && !s.d.includes('s')) { // Vertical centering
            if (s.o && co) this.x.translate(0, -s.o[3]/2);
            else if(s.f && !cf) this.x.translate(0, -this.imgs[s.f].height/2);
            this.x.textBaseline = 'middle';
        }
        if (s.d && s.d.includes('e')) { // Horizontal align to end
            if (s.o && co) this.x.translate(-s.o[2], 0);
            this.x.textAlign = 'end';
        }
        if (s.d && s.d.includes('s')) { // Vertical align to end
            if (s.o && co) this.x.translate(0, -s.o[3]);
            this.x.textBaseline = 'bottom';
        }
        // Position
        if (s.x) this.x.translate(s.x, 0);
        if (s.y) this.x.translate(0, s.y);
        // Image
        if (s.f != undefined && s.f in this.imgs)
            if (s.o && co) this.x.drawImage(this.imgs[s.f], s.o[0], s.o[1], s.o[2], s.o[3], 0, 0, s.o[2], s.o[3]);
            else           this.x.drawImage(this.imgs[s.f], 0, 0);
        // Rectangle
        if (s.r && s.r.length == 4) {
            if (cf) this.x.fillRect.apply(this.x, s.r);
            if (cs) this.x.strokeRect.apply(this.x, s.r);
        }
        // Path
        if (s.p) {
            let n = 0;
            this.x.beginPath();
            for (const p of s.p) {
                // Starting point
                if (p.length == 2 && !n) this.x.moveTo(p[0], p[1]);
                // Straight line
                else if (p.length == 2)  this.x.lineTo(p[0], p[1]);
                // Next point
                n++;
            }
            console.log(s.p);
            if (cf) this.x.fill();
            if (cs) this.x.stroke();
        }
        // Text
        if (s.t) {
            if (s.n) this.x.font = s.n;
            if (!cf) this.x.fillStyle = '#000';
            if (!cf && !cs || cf) this.x.fillText(s.t, 0, 0);
            if (cs) this.x.strokeText(s.t, 0, 0);
        }
        // Restore
        this.x.restore();
    }
    sprites(...sprites:sprite[]) {
        // Sets relative position/scaling
        //this.x.save();
        // P(x,y)
        //this.x.transform(this.camera.z, 0, 0, this.camera.z, this.w/2-this.camera.x*this.camera.z, this.h/2-this.camera.y*this.camera.z);

        // Iterates each child
        for (const s of sprites) this.sprite(s);
        //this.x.restore();
    }
    /* ----- EVENTLISTENER ----- */
    /**
     * ### Keys being pressed directionary
     * Each `this.key[key]` has 3 bits representing
     * - Ctrl key pressed
     * - Shift key pressed
     * - Alt key pressed
     * If key is not pressed then `this.key[key]` is undefined
     */
    key:{[index:string]:number} = {};
    /**
     * ### Mouse status
     * The current mouse status in an array of numbers, in order of:
     * - `x` - X position relative to canvas, relative to its dimensions
     * - `y` - Y position relative to canvas, relative to its dimensions
     * - `button` - Button being pressed
     * - `sx` - Scrolled X distance
     * - `sy` - Scrolled Y distance
     * - `rx` - X position relative to camera
     * - `ry` - Y position relative to camera
     */
    mouse:Mouse;
    /**
     * ### Add event listeners to element for game
     */
    listen() {
        addEventListener('keydown', e => {
            this.key[e.key.toLowerCase()] = Number(e.ctrlKey)+Number(e.shiftKey)<<1+Number(e.altKey)<<2;
        });
        addEventListener('keyup', e => {
            delete this.key[e.key.toLowerCase()];
        });
    }
    /* ----- CONSTRUCTOR ----- */
    constructor(dom:HTMLCanvasElement|string='', w:number, h:number, z:number=1) {
        this.dom = typeof dom != 'string' ? dom : dom.length && document.querySelector(dom) ? document.querySelector(dom)! : document.createElement('canvas');
        this.w = w;
        this.h = h;
        this.x = this.dom.getContext('2d')!;
        this.mouse = new Mouse(this);
        this.listen();
        this.mouse.listen(window);
        this.z = z;
        this.x.imageSmoothingEnabled = false;
    }
    private _wait:number = 0;
    private _times:DOMHighResTimeStamp[] = [];
    private _start:DOMHighResTimeStamp;
    set fps(fps:number) { this._wait = fps ? 2000/fps : 0; }
    get fps(  ):number  { return this._times.length; }
    entity:Entity[] = [];
    add(...entities:Entity[]) {
        for (const entity of entities) this.entity.push(entity);
    }
    /**
     * ### Renders each frame
     * @param func - Function to loop every frame
     */
    render(func:(dt:number,t:number)=>void=()=>{}, init=true) {
        // Timing system (Delta-time, and FPS)
        let d = performance.now();
        let dt = this._times.length ? d-this._times[this._times.length-1] : 0;
        this._times = this._times.filter(t => d-t<=1000);
        this._times.push(d);
        if (init) this._start = d;

        // Main function
        this.x.save();
        this.x.scale(this._z, this._z);
        func.call(this, dt/1000, d-this._start);
        this.x.restore();

        // Rendering entities
        for (const entity of this.entity) {
            this.sprites(...entity.render(this, dt/1000, d-this._start));
        }

        // Interval
        this.mouse.reset();
        setTimeout(()=>this.render(func, false), this._wait-dt > 0 ? this._wait-dt : 0);
    }
}