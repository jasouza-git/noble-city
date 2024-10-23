import { Building } from '.';
import { Camera, sprite } from '../src/engine';

export class Fishing extends Building {
    static res = ['building/fishing.png'];
    static key = 'fishing';
    item = 'building/fishing.png';
    name = 'Fishing Area';
    price = 50000;
    render(dt:number, t:number, cam:Camera):sprite[] {
        return [this.base(dt,t,cam,0.75), {
            f: 'building/fishing.png',
            m: [1,0,0,1,5,-35],
            p: [[-70, -80],[],[145, 110],[]],
        }];
    }
}