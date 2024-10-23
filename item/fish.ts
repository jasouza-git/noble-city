import { Item } from '.';
import { Camera } from '../src/engine';

export class Fish extends Item {
    static res = ['item/fish.png'];
    name = 'Fish';
    price = 175;
    color = '#83D6DC';
    render(dt:number, t:number, cam:Camera) {
        return [this.base(dt,t,cam), {
            f: 'item/fish.png',
            s: 0.125,
            m: [1,0,0,1,0,-70],
        }];
    }
}