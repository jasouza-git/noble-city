import { sprite, Camera, Entity } from '../src/engine';

export class LoadMenu extends Entity {
    /**
     * Percentage from 0 to 1
     */
    per:number = 0;
    /**
     * Start post-loaded content
     */
    start:()=>void = ()=>{};
    render(dt:number, t:number, cam:Camera):sprite[] {
        if (this.eng == null) return [];
        return [ {c:0},
            ...(this.per != 1 ? [
                { // Loading bar border
                    p: [[-100, -10],[],[200, 20],[],],
                    b: this.per < 0 ? 'red' : 'white',
                    bz: 2,
                    x: cam.w/2,
                    y: cam.h/2,
                },
                { // Loading bar percentage
                    a: this.per < 0 ? 0 : 1,
                    p: [[-96, -6],[],[192*this.per, 12],[],],
                    f: 'white',
                    x: cam.w/2,
                    y: cam.h/2,
                },
                { // Loading bar title
                    t: this.per < 0 ? 'Error loading assets' : 'Loading...',
                    f: this.per < 0 ? 'red' : 'white',
                    x: cam.w/2,
                    y: cam.h/2-30,
                },
                { // Error Message
                    a: this.per < 0 ? 0.75 : 0,
                    t: `failed: ${this.eng.load_err[this.eng.load_err.length-1]}`,
                    tz: 15,
                    f: 'red',
                    x: cam.w/2,
                    y: cam.h/2+30,
                }
            ]: [
                { // Fullscreen text
                    x: cam.w/2,
                    y: cam.h/2,
                    t: 'Click to start game',
                    f: 'white',
                },
                { // Fullscreen trigger
                    p: [[0,0],[],[cam.w, cam.h],[]],
                    click: s => this.start(),
                }
            ])
        ]
    }
}