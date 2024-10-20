import { Camera, sprite } from '../../engine';
import { Building } from "../building";

export class Bank extends Building {
    static res = ['building/bank.png'];
    static key = 'bank';
    own = 0;
    name = 'DBO Bank';
    render(dt:number, t:number, cam:Camera):sprite[] {
        return [this.base(dt,t,cam), {
            f: 'building/bank.png',
            p: [[-62, -100],[],[133, 130],[]],
            m: [1,0,0,1,4,-32],
        }];
    }
}

