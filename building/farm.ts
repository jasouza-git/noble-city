import { Building } from '.';
import { box } from '../component/ui';
import { Camera, merge, sprite } from '../src/engine';
import { Process, process, process_session } from '../item/_';
import { Item } from '../item';
import { economy } from '../src/economy';

export class Farm extends Building {
    static res = ['building/farm.png', 'ui/arrow.png', 'ui/arrow_off.png'];
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
    processes:process_session[] = Process.reduce((res,p,id) => {
        if (p.type == 'farm') res.push({
            id: id,
            in: p.in.map(x=>new x()),
            out: p.out.map(x=>new x()),
            amount: p.amount,
            dur: p.dur,
        });
        return res;
    }, [] as process_session[]);
    menu(dt:number, t:number, cam:Camera, r:number):sprite[] {
        let own = economy.own.includes(this);
        return [
            // Recipes
            ...(own ? this.processes.slice(this.page*5, 5*(this.page+1)).map((p,n) => {
                return [
                    // Container
                    ...box({x:0, y:-82+48*n}, cam, 19, 2, 1),
                    ...box({x:132, y:-92+48*n, f:'ui/triangle.png', r:-Math.PI/2}, cam, 0.75, 0.75, 4),
                    ...box({x:132, y:-72+48*n, f:'ui/triangle.png', r:Math.PI/2}, cam, 0.75, 0.75, 4),
                    // Input Items
                    ...p.in.map((x,m) => {
                        return [
                            // Icon
                            ...merge(x.render(dt, t, cam)).map(s => {
                                s.x = -120+35*m;
                                s.y = -73+48*n;
                                return s;
                            }),
                            // Number
                            {t:String(p.amount[m]), x:-120+35*m, y:-70+48*n, b:'#FBE7CD', bz:2, f:'black', tz:10 },
                        ];
                    }).flat(),
                    // Output Items
                    ...p.out.map((x,m) => {
                        return [
                            // Icon
                            ...merge(x.render(dt, t, cam)).map(s => {
                                s.x = 70+35*m;
                                s.y = -73+48*n;
                                return s;
                            }),
                            // Number
                            {t:String(p.amount[p.in.length+m]), x:-120+35*m, y:-70+48*n, b:'#FBE7CD', bz:2, f:'black', tz:10 },
                        ];
                    }).flat(),
                    // Process
                    { f:'ui/arrow_off.png', s:0.125, y:-72+48*n },
                    { t:`${p.dur} days`, y:-85+48*n, tz:10 }
                ]
            }).flat() : [
                // You do not own the building
                { t:'You dont own this', tz:15, a:0.5 },
            ]),
            
            // Up and Down
            ...box({x:-170+40*(1-r), y:50, f:'ui/triangle.png', r:-Math.PI/2, click: s => {
                this.page--;
            }}, cam, 1, 1, this.page <= 0 || !own ? 3 : 0),
            ...box({x:-170+40*(1-r), y:80, f:'ui/triangle.png', r:Math.PI/2, click: s => {
                this.page++;
            }}, cam, 1, 1, this.page*5+5 >= this.processes.length || !own ? 3 : 0),
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