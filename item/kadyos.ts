import { Item } from '.';
import { Camera } from '../src/engine';

export class Kadyos extends Item {
    static res = ['item/kadyos.png'];
    name = 'Kadyos';
    price = 200;
    color = '#69C72E';
    render(dt:number, t:number, cam:Camera) {
        return [this.base(dt,t,cam), {
            f: 'item/kadyos.png',
            s: 0.125,
            m: [1,0,0,1,0,-90],
        }];
    }
}