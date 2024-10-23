import { Item } from '.';
import { Camera } from '../src/engine';

export class Garlic extends Item {
    static res = ['item/garlic.png'];
    name = 'Garlic';
    price = 250;
    render(dt:number, t:number, cam:Camera) {
        return [this.base(dt,t,cam), {
            f: 'item/garlic.png',
            s: 0.125,
            m: [1,0,0,1,0,-70],
        }];
    }
}