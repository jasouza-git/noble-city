import { Building } from '.';
import { Camera, sprite } from '../src/engine';

export class Farm extends Building {
    static res = ['building/farm.png'];
    static key = 'farm';
    item = 'building/farm.png';
    name = 'Farm';
    price = 50000;
    render(dt:number, t:number, cam:Camera):sprite[] {
        return [this.base(dt,t,cam), {
            f: 'building/farm.png',
            p: [[-64, -49],[],[120, 97],[]],
            m: [1,0,0,1,0,-10],
        }];
    }
}