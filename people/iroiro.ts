import { Person } from '.';
import { Camera, sprite } from '../src/engine';

export class Iroiro extends Person {
    static res = ['people/iroiro_body.png', 'people/iroiro_head.png'];
    name = 'Iroiro';
    render(dt:number, t:number, cam:Camera, num:number):sprite[] {
        let body = (num>>8)&1;
        let head = num&7;
        return [ {c:0},
            { f:'people/iroiro_body.png', s:0.25, crop:[0,900*0,900,900], y:Math.sin(t/150+Math.PI/2)+50 },
            { f:'people/iroiro_head.png', s:0.25, crop:[900*(head%2),900*Math.floor(head/2),900,900], y:-45+Math.sin(t/150) },
        ]
    }
}