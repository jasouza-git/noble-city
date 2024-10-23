import { Building } from '.';
import { box } from '../component/ui';
import { Camera, merge, sprite } from '../src/engine';
import { Items } from '../item/_';
import { economy } from '../src/economy';

export class CalleReal extends Building {
    static res = ['building/callereal.png', 'ui/triangle.png'];
    static key = 'callereal';
    static depend = Items;
    item = 'building/callereal.png';
    own = 0;
    name = 'Calle Real';
    page:number = 0;
    highlight:number = -1;
    render(dt:number, t:number, cam:Camera):sprite[] {
        return [this.base(dt,t,cam), {
            f: 'building/callereal.png',
            p: [[-85, -140],[],[185, 160],[]],
            m: [1,0,0,1,0,-60],
        }];
    }
    menu(dt:number, t:number, cam:Camera, r:number):sprite[] {
        let max = Math.max(...economy.item_prices.slice(4*this.page,4*(this.page+1)).flat());
        //this.highlight = -1;
        //console.log(max);
        return [
            // Price of goods
            ...box({x:0,y:-98}, cam, 19, 4, 2),
            ...economy.item_prices.slice(4*this.page,4*(this.page+1)).map((p,n) => {
                return {
                    p:p.length < 2 ? [[0,55*(1-(p[0]??0)/max)],[270,55*(1-(p[0]??0)/max)]] : p.map((x,n)=>[270*n/(p.length-1),55*(1-x/max)]),
                    b:this.highlight==n? 'red' : economy.item[4*this.page+n].color||['red','yellow','green','blue'][n],
                    x:-135,
                    y:-125,
                    bz:this.highlight==n? 3 : 2,
                    a:this.highlight==n? 1 : 0.5,
                };
            }),
            //{ p: [[-135,-125],[],[270,55],[]], f:'red', a:0.5 },

            // Products
            ...economy.items.slice(4*this.page,4*(this.page+1)).map((i,n) => {
                return [
                    // Box
                    ...box({x:0, y:-36+48*n, hover: s => {
                        this.highlight = n;
                    }, click: s => {
                        economy.buy(i);
                    }}, cam, 19, 2),
                    // Item Icon
                    ...merge(i.render(dt, t, cam)).map(s => {
                        s.x = -120;
                        s.y = -26+48*n;
                        return s;
                    }),
                    // Item Name
                    { t: i.name, x:-100, y:-46+48*n, o:'nw', tz:15 } as sprite,
                    // Price
                    { t: String(i.price), x:130, y:-35+48*n, o:'e', tz:15, a:0.75 } as sprite,
                    // Quantity
                    { t: String(i.quantity), x:-100, y:-20+48*n, o:'sw', tz:10, a:0.75 } as sprite,
                ];
            }).flat(),
            // Up and Down
            ...box({x:-170+40*(1-r), y:50, f:'ui/triangle.png', r:-Math.PI/2, click: s => {
                this.page--;
            }}, cam, 1, 1, this.page > 0 ? 0 : 3),
            ...box({x:-170+40*(1-r), y:80, f:'ui/triangle.png', r:Math.PI/2, click: s => {
                this.page++;
            }}, cam, 1, 1, this.page*4+4 < economy.items.length ? 0 : 3),
        
            // No hovered
            { p:[[-142,-57],[],[285,187],[]], nohover: s=> {
                this.highlight = -1;
            } },
        ];
    }
}