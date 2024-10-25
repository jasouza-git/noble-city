import { Production } from './production';
import { Camera, sprite } from '../src/engine';

export class Factory extends Production {
    static res = ['building/factory.png'];
    static key = 'factory';
    item = 'building/factory.png';
    name = 'Factory';
    price = 50000;
    type = 'factory';
    //init = true;
    render(dt:number, t:number, cam:Camera):sprite[] {
        /*if (!this.eng) return [];
        if (this.init) { this.init = false; this.eng.debug.p = [[0,0],[100,0]]; this.eng.debug.pn = 0; }
        this.eng.debug.pp(dt);*/
        return [this.base(dt,t,cam), {
            f: 'building/factory.png',
            p: [[-19,-115],[26,-125],[69,-102],[69,-48],[91,-36],[91,-4],[85,9],[60,6],[62,21],[49,25],[38,18],[29,20],[22,14],[0,21],[-66,-19],[-81,-20],[-81,-31],[-87,-33],[-87,-43],[-74,-46],[-74,-90],[-59,-103],[-22,-84]],
            m: [1,0,0,1,0,-50],
        }];
    }
}