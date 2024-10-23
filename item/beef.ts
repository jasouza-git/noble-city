import { Item } from '.';
import { Camera } from '../src/engine';

export class Beef extends Item {
    static res = ['item/beef.png'];
    name = 'Beef';
    price = 400;
    color = '#D36262';
    render(dt:number, t:number, cam:Camera) {
        return [this.base(dt,t,cam), {
            f: 'item/beef.png',
            s: 0.125,
            m: [1,0,0,1,0,-90],
        }];
    }
}