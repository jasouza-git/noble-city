import { Item } from '.';
import { Camera } from '../src/engine';

export class Soup extends Item {
    static res = ['item/soup.png'];
    name = 'Soup';
    price = 35;
    render(dt:number, t:number, cam:Camera) {
        return [this.base(dt,t,cam), {
            f: 'item/soup.png',
            s: 0.15,
            m: [1,0,0,1,0,-60],
        }];
    }
}