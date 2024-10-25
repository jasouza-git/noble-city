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
    page_focus:number = -1;
    highlight:number = -1;
    keytype:string|null = null;
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
        let pf = this.page_focus;
        let pfc = pf != -1;
        if (this.keytype != null && this.eng != null) {
            let inp = this.eng.inp;
            Object.keys(inp.dkey).forEach(k => {
                if (inp.dkey[k] != 0) return;
                let b = k == 'backspace';
                if ('0123456789'.includes(k) || b) {
                    if (this.keytype == 'all') this.keytype = '';
                    if (b) this.keytype = this.keytype == null ? '' : this.keytype.slice(0,-1)
                    else this.keytype += k;
                }
            })
        }
        return [
            // Price of goods
            ...box({x:0,y:-98}, cam, 19, 4, 2),
            ...economy.item_prices.slice(pfc ? pf: 4*this.page, pfc ? pf+1: 4*(this.page+1)).map((p,n) => {
                return {
                    p:p.length < 2 ? [[0,55*(1-(p[0]??0)/max)],[270,55*(1-(p[0]??0)/max)]] : p.map((x,n)=>[270*n/(p.length-1),55*(1-x/max)]),
                    b:pfc || this.highlight==n? 'red' : economy.item[4*this.page+n].color||['red','yellow','green','blue'][n],
                    x:-135,
                    y:-125,
                    bz:pfc||this.highlight==n? 3 : 2,
                    a:pfc||this.highlight==n? 1 : 0.5,
                };
            }),
            //{ p: [[-135,-125],[],[270,55],[]], f:'red', a:0.5 },

            // Products
            ...(this.page_focus == -1 ? [
                ...economy.items.slice(4*this.page,4*(this.page+1)).map((i,n) => {
                    return [
                        // Box
                        ...box({x:0, y:-36+48*n, hover: s => {
                            this.highlight = n;
                        }, click: s => {
                            this.page_focus = 4*this.page+n;
                            //economy.product(i, this.sell);
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
                        { t: String(economy.get_item(i)?.quantity), x:-100, y:-20+48*n, o:'sw', tz:10, a:0.75 } as sprite,
                        // Amounts
                    ];
                }).flat(),

                // Up and Down
                ...box({x:-170+40*(1-r), y:50, f:'ui/triangle.png', r:-Math.PI/2, click: s => {
                    this.page--;
                }}, cam, 1, 1, this.page > 0 ? 0 : 3),
                ...box({x:-170+40*(1-r), y:80, f:'ui/triangle.png', r:Math.PI/2, click: s => {
                    this.page++;
                }}, cam, 1, 1, this.page*4+4 < economy.items.length ? 0 : 3),
            
            ] : [
                // Box
                /*...box({x:0, y:-36/*, click: s => {
                    economy.product(economy.items[], this.sell);
                }*}, cam, 19, 2, 1),*/
                // Item Icon
                ...merge(economy.items[this.page_focus].render(dt, t, cam)).map(s => {
                    s.x = -120;
                    s.y = -31;
                    return s;
                }),
                // Item Name
                { t: economy.items[this.page_focus].name, x:-95, y:-36, o:'w', tz:15 } as sprite,
                // Information
                { t:'Market Price: ', x:-135, y:-10, o:'w', tz:10 } as sprite,
                { t:String(economy.items[this.page_focus].price), x:40, y:-10, o:'w', tz:10, a:0.75 } as sprite,
                { t:'In Circulation: ', x:-135, y:10, o:'w', tz:10 } as sprite,
                { t:String(economy.items[this.page_focus].quantity), x:40, y:10, o:'w', tz:10, a:0.75 } as sprite,
                { t:'Currently owned: ', x:-135, y:30, o:'w', tz:10 } as sprite,
                { t:String(economy.get_item(economy.items[this.page_focus])?.quantity), x:40, y:30, o:'w', tz:10, a:0.75 } as sprite,
                { t:'Make a transaction', y:60, tz:10, a:0.5},
                { t:'Quantity:', x:-135, y:82, o:'w', tz:10 } as sprite,
                // Transaction
                ...box({x:30,y:82,click: s=> {
                    if (this.keytype == null) this.keytype = '';
                }}, cam, 8, 1, 2),
                ...box({x:110,y:82, t:'all', tz:10, f:'black', bz:0, click:s=>{
                    this.keytype = 'all';
                }}, cam, 2, 1),
                { t:(this.keytype!=null?this.keytype+'\u2502':''), x:-25, y:82, o:'w', tz:10 } as sprite,
                // Buy sell
                ...box({x:-70,y:115, t:'buy', tz:10, f:'black', bz:0, click: s=> {
                    economy.product(economy.items[this.page_focus], this.keytype == 'all' ? economy.items[this.page_focus].quantity : Number(this.keytype??'1'));
                }}, cam, 8, 1),
                ...box({x:70,y:115, t:'sell', tz:10, f:'black', bz:0, click: s=> {
                    economy.product(economy.items[this.page_focus], this.keytype == 'all' ? -(economy.get_item(economy.items[this.page_focus])?.quantity??1) : -Number(this.keytype??'1'));
                }}, cam, 8, 1),

                // Back
                ...box({x:-170+40*(1-r), y:50, f:'ui/triangle.png', r:Math.PI, click: s => {
                    this.page_focus = -1;
                    this.keytype = null;
                }}, cam),
            ] ),

            // Buy/Sell
            /*...box({x:-240+110*(1-r), y:80, t:this.sell?'Buy':'Sell', tz:15, click: s => {
                this.sell = !this.sell;
            }}, cam, 6, 1),*/

            // No hovered
            { p:[[-142,-57],[],[285,187],[]], nohover: s=> {
                this.highlight = -1;
            } },
        ];
    }
}