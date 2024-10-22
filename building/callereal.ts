import { Building } from '.';
import { box } from '../component/ui';
import { Camera, Entity, merge, sprite } from '../src/engine';
import { Items } from '../item/_';
import { Item } from '../item';
import { map_obj } from '../component/map';

export class CalleReal extends Building {
    static res = ['building/callereal.png', 'ui/triangle.png'];
    static key = 'callereal';
    static depend = Items;
    item = 'building/callereal.png';
    own = 0;
    name = 'Calle Real';
    items:Item[] = [];
    page:number = 0;
    constructor(map:Entity, x:number, y:number, m:map_obj) {
        super(map, x, y, m);
        for (const i of Items) this.items.push(new i());
    }
    render(dt:number, t:number, cam:Camera):sprite[] {
        return [this.base(dt,t,cam), {
            f: 'building/callereal.png',
            p: [[-85, -140],[],[185, 160],[]],
            m: [1,0,0,1,0,-60],
        }];
    }
    menu(dt:number, t:number, cam:Camera, r:number):sprite[] {
        return [
            // Price of goods
            ...box({x:0,y:-98}, cam, 19, 4, 2),
            // Products
            ...this.items.slice(4*this.page,4*(this.page+1)).map((i,n) => {
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
            }}, cam, 1, 1, this.page*4+4 < this.items.length ? 0 : 3),
        ];
    }
}