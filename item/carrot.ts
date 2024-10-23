import { Item } from '.';
import { Camera } from '../src/engine';

export class Carrot extends Item {
    static res = ['item/carrot.png'];
    name = 'Carrot';
    price = 130;
    color = '#FF9C53';
    render(dt:number, t:number, cam:Camera) {
        return [this.base(dt,t,cam), {
            f: 'item/carrot.png',
            s: 0.125,
            m: [1,0,0,1,0,-70],
        }];
    }
}