import { Person } from '.';
import { Camera, sprite } from '../src/engine';

export class Mentor extends Person {
    static res = ['people/mentor_body.png', 'people/mentor_head.png'];
    name = 'Mentor';
    render(dt:number, t:number, cam:Camera, num:number):sprite[] {
        let body = num&3;
        let head = (num>>2)&3;
        return [ {c:0},
            { f:'people/mentor_body.png', s:0.25, crop:[900*(body%2),900*Math.floor(body/2),900,900], y:Math.sin(t/150+Math.PI/2) },
            { f:'people/mentor_head.png', s:0.25, crop:[900*(head%2),900*Math.floor(head/2),900,900], y:-60+Math.sin(t/150) },
        ]
    }
}