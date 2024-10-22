import { Camera, sprite } from '../../engine';
import { Building } from "../building";

export class CalleReal extends Building {
    static res = ['building/callereal.png'];
    static key = 'callereal';
    own = 0;
    name = 'CalleReal';
    render(dt:number, t:number, cam:Camera):sprite[] {
        return [this.base(dt,t,cam), {
            f: 'building/callereal.png',
            p: [[-85, -140],[],[185, 160],[]],
            m: [1,0,0,1,0,-60],
        }];
    }
}