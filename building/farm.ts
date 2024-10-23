import { Building } from '.';
import { box } from '../component/ui';
import { Camera, merge, sprite } from '../src/engine';
import { Process, process } from '../item/_';
import { Item } from '../item';

export class Farm extends Building {
    static res = ['building/farm.png', 'ui/arrow.png'];
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
    page = 0;
    processes:{
        in:Item[],
        out:Item[],
    }[] = Process.filter(x=>x.type=='farm').map(p => {
        return {
            in: p.in.map(x=>new x()),
            out: p.out.map(x=>new x()),
        };
    });
    menu(dt:number, t:number, cam:Camera, r:number):sprite[] {
        return [
            ...this.processes.slice(this.page*5, 5*(this.page+1)).map((p,n) => {
                return [
                    // Container
                    ...box({x:0, y:-82+48*n}, cam, 16, 2),
                    ...box({x:-130, y:-75+48*n}, cam, 1, 1),
                    // Input Items
                    /*...p.in.map(x => {
                        return merge(x.render(dt, t, cam)).map(s => {
                            s.x = -120;
                            s.y = -73+48*n;
                            return s;
                        })
                    }).flat(),
                    // Process
                    { f:'ui/arrow.png', s:0.125, y:-82+48*n },*/
                ]
            }).flat(),
            // Products
            /*...this.items.slice(4*this.page,4*(this.page+1)).map((i,n) => {
                return [
                    // Box
                    ...box({x:0, y:-36+48*n}, cam, 19, 2),
                    // Item Icon
                    ...merge(i.render(dt, t, cam)).map(s => {
                        s.x = -120;
                        s.y = -26+48*n;
                        return s;
                    }),
                    // Item Name
                    { t: i.name, x:-100, y:-46+48*n, o:'nw', tz:15 } as sprite,
                ];
            }).flat(),
            // Up and Down
            ...box({x:-170+40*(1-r), y:50, f:'ui/triangle.png', r:-Math.PI/2, click: s => {
                this.page--;
            }}, cam, 1, 1, this.page > 0 ? 0 : 3),
            ...box({x:-170+40*(1-r), y:80, f:'ui/triangle.png', r:Math.PI/2, click: s => {
                this.page++;
            }}, cam, 1, 1, this.page*4+4 < this.items.length ? 0 : 3),*/
        ];
    }
}