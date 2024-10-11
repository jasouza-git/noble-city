import { Game, Entity } from './engine';
/**
 * ### Noble City Game
 * A tycoon game about managing your bussiness
 */
export class NobleCity extends Game {
    constructor(dom:HTMLCanvasElement|string='', w=480, h=270) {
        super(dom, w, h, 1);
        this.fps = 0;
    }
    load(...entities:typeof Entity[]) {
        let toload:string[] = [];
        for (const entity of entities) toload.push(...entity.res);
        this.load_img((a,b) => {
            if (a/b == 1) this.render(this.menu);
        }, ...toload)
    }
    draw = (dt:number, t:number) => {};
    menu(dt:number, t:number) {
        let w=this.w, h=this.h, dz=this.mouse.dsy;
        // Zooming effects
        if (dz) {
            let z = Math.pow(2, -dz/100);
            z = Math.min(8, this.camera.z*z)/this.camera.z;    // Max zoom in
            z = Math.max(0.125, this.camera.z*z)/this.camera.z; // Max zoom out
            this.camera.x += (z-1)*this.mouse.rx; // NOTE! Doesnt work properly
            this.camera.y += (z-1)*this.mouse.ry; // NOTE! Doesnt work properly
            this.camera.z *= z;
        }
        // Reset dragging delta
        if (this.mouse.db && this.mouse.b&1) {
            this.mouse.dx = 0;
            this.mouse.dy = 0;
        }
        // Dragging effects
        if (this.mouse.b&1) { 
            this.camera.x -= this.mouse.dx/this.camera.z;
            this.camera.y -= this.mouse.dy/this.camera.z;
        }
        // Keyboard camera
        let v = 100/this.camera.z*dt;
        if (('d' in this.key || 'a' in this.key) && ('w' in this.key || 's' in this.key)) v /= Math.sqrt(2);
        if ('d' in this.key) this.camera.x += v;
        if ('a' in this.key) this.camera.x -= v;
        if ('w' in this.key) this.camera.y -= v;
        if ('s' in this.key) this.camera.y += v;


        this.rect('#4C7133', 0, 0, w, h);
        this.draw(dt, t);
    }
}