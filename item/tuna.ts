import { Item } from '.';
import { Camera } from '../src/engine';

export class Tuna extends Item {
    static res = ['item/tuna.png'];
    name = 'Tuna';
    price = 270;
    color = '#D83939';
    render(dt:number, t:number, cam:Camera) {
        return [this.base(dt,t,cam), {
            f: 'item/tuna.png',
            s: 0.15,
            m: [1,0,0,1,0,-60],
        }];
    }
}