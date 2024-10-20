import { Camera, sprite } from '../../engine';
import { Building } from "../building";

export class Factory extends Building {
    static res = ['building/factory.png'];
    static key = 'factory';
    name = 'Factory';
    render(dt:number, t:number, cam:Camera):sprite[] {
        return [this.base(dt,t,cam), {
            f: 'building/factory.png',
            p: [[-75, -125],[],[165, 145],[]],
            m: [1,0,0,1,0,-50],
        }];
    }
}