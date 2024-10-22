import { Item } from '.';
import { Camera } from '../src/engine';

export class Pork extends Item {
    static res = ['item/pork.png'];
    name = 'Pork';
    price = 350;
    render(dt:number, t:number, cam:Camera) {
        return [this.base(dt,t,cam), {
            f: 'item/pork.png',
            s: 0.125,
            m: [1,0,0,1,0,-90],
        }];
    }
}