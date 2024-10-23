import { Item } from '.';
import { Camera } from '../src/engine';

export class Chicken extends Item {
    static res = ['item/chicken.png'];
    name = 'Chicken';
    price = 185;
    render(dt:number, t:number, cam:Camera) {
        return [this.base(dt,t,cam), {
            f: 'item/chicken.png',
            s: 0.125,
            m: [1,0,0,1,0,-90],
        }];
    }
}