import { Item } from '.';
import { Camera } from '../src/engine';

export class Fertilizer extends Item {
    static res = ['item/fertilizer.png'];
    name = 'Fertilizer';
    price = 32;
    render(dt:number, t:number, cam:Camera) {
        return [this.base(dt,t,cam), {
            f: 'item/fertilizer.png',
            s: 0.125,
            m: [1,0,0,1,0,-70],
        }];
    }
}