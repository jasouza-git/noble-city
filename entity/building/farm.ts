import { Camera, sprite } from '../../engine';
import { Building } from "../building";

export class Farm extends Building {
    static res = ['building/farm.png'];
    static key = 'farm';
    name = 'Farm';
    render(dt:number, t:number, cam:Camera):sprite[] {
        return [this.base(dt,t,cam), {
            f: 'building/farm.png',
            p: [[-64, -49],[],[120, 97],[]],
        }];
    }
}