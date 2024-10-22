import { Item } from '.';
import { Camera } from '../src/engine';

export class Langka extends Item {
    static res = ['item/langka.png'];
    name = 'Langka';
    price = 100;
    render(dt:number, t:number, cam:Camera) {
        return [this.base(dt,t,cam), {
            f: 'item/langka.png',
            s: 0.125,
            m: [1,0,0,1,0,-90],
        }];
    }
}