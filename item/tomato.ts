import { Item } from '.';
import { Camera } from '../src/engine';

export class Tomato extends Item {
    static res = ['item/tomato.png'];
    name = 'Tomato';
    price = 80;
    color = '#FF2B2B';
    render(dt:number, t:number, cam:Camera) {
        return [this.base(dt,t,cam), {
            f: 'item/tomato.png',
            s: 0.125,
            m: [1,0,0,1,0,-90],
        }];
    }
}