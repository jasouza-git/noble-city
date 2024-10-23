import { Item } from '.';
import { Camera } from '../src/engine';

export class Radish extends Item {
    static res = ['item/radish.png'];
    name = 'Radish';
    price = 50;
    color = '#C6FAC4';
    render(dt:number, t:number, cam:Camera) {
        return [this.base(dt,t,cam), {
            f: 'item/radish.png',
            s: 0.125,
            m: [1,0,0,1,0,-90],
        }];
    }
}