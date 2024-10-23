import { Item } from '.';
import { Camera } from '../src/engine';

export class Worm extends Item {
    static res = ['item/worm.png'];
    name = 'Worm';
    price = 100;
    color = '#793D34';
    render(dt:number, t:number, cam:Camera) {
        return [this.base(dt,t,cam), {
            f: 'item/worm.png',
            s: 0.125,
            m: [1,0,0,1,0,-90],
        }];
    }
}