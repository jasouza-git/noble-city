import {sprite, Engine, Camera, Entity} from '../engine';

class rec extends Entity {
    color = 'red';
    y = 0;
    x = 0;

    constructor(color:string) {
        super();
        this.color = color;
    }
    render(dt:number, t:number, game:Engine, cam:Camera):sprite[] {
        return [{},
            {f:this.color, x:this.x, y:this.y, p:[
                [-25,-25], [],
                [50, 50]
            ],
                s:2,
                crop:[Math.floor(t/50)%3*22,0,22,23],
                a:0.5,
                cur: 'cell',
            }
        ]
    }
}

let e = new Engine;
let cam = new Camera('#game', e);
e.base = '/assets/';
let r = new rec('red');
let r2 = new rec('blue');

e.scenes.push([r]);
e.scenes.push([r2]);
e.scene = 0;

e.loop = () => {
    if ('a' in e.inp.dkey) e.scene = 1;
    if ('d' in e.inp.dkey) e.scene = 0;
    r.y = e.inp.ry;
    r.x = e.inp.rx;
};

e.load_res(p=>{
    if (p == 1) {
        r.color = 'coins.png';
    } else if (p == -1) r.color = 'yellow';
}, 'coins.png');
