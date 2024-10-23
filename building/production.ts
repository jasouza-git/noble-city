import { Building } from '.';
import { box } from '../component/ui';
import { Camera, Entity, merge, sprite } from '../src/engine';
import { Process, process_session } from '../item/_';
import { economy } from '../src/economy';
import { map_obj } from '../component/map';

export class Production extends Building {
    static res = ['ui/arrow.png', 'ui/arrow_off.png'];
    page = 0;
    /**
     * What type of process
     */
    type:string = '';
    processes:process_session[] = [];
    setted_process:boolean = false;
    set_process() {
        if (this.type == '') return;
        this.processes = Process.reduce((res,p,id) => {
            if (p.type == this.type) res.push({
                id: id,
                in: p.in.map(x=>new x()),
                out: p.out.map(x=>new x()),
                amount: p.amount,
                dur: p.dur,
                left: p.dur,
                on: false,
                ongoing: false,
            });
            return res;
        }, [] as process_session[]);
        this.setted_process = true;
    }
    menu(dt:number, t:number, cam:Camera, r:number):sprite[] {
        if (!this.setted_process) this.set_process();
        let own = economy.own.includes(this);
        let k:any;
        return [
            // Main window
            ...(own ? [
                // Assets
                ...merge((k=economy.item.filter(x=>x.name == 'Fertilizer')[0]).render(dt,t,cam)).map(s => {
                    s.x = -130;
                    s.y = -115;
                    s.s = (s.s??1)*0.75;
                    return s;
                }),
                k.num(-130, -105),
                // Processes
                ...this.processes.slice(this.page*5, 5*(this.page+1)).map((p,n) => {
                    return [
                        // Container, trigger of processes
                        ...box({x:0, y:-82+48*n, click: s => {
                            if (economy.process(p)) p.on = !p.on;
                        }}, cam, 19, 2, p.ongoing ? 3 : 0),
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
                                x.num(-120+35*m, -73+48*n, p.amount[m]),
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
                                x.num(70+35*m, -73+48*n, p.amount[p.in.length+m]),
                            ];
                        }).flat(),
                        // Process
                        { f:p.on?'ui/arrow.png':'ui/arrow_off.png', s:0.125, y:-72+48*n },
                        { t:p.on?`${p.left} days left`:`${p.dur} days`, y:-85+48*n, tz:10 }
                    ]
                }).flat(),
            ] : [
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
        ];
    }
}