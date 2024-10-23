import { Production } from './production';
import { Camera, sprite } from '../src/engine';

export class Farm extends Production {
    static res = ['building/farm.png', 'ui/arrow.png', 'ui/arrow_off.png'];
    static key = 'farm';
    item = 'building/farm.png';
    name = 'Farm';
    price = 50000;
    type = 'farm';
    render(dt:number, t:number, cam:Camera):sprite[] {
        return [this.base(dt,t,cam), {
            f: 'building/farm.png',
            p: [[-64, -49],[],[120, 97],[]],
            m: [1,0,0,1,0,-10],
        }];
    }
}