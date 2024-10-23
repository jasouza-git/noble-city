import { Building } from '.';
import { Camera, sprite } from '../src/engine';
import { economy } from '../src/economy';
import { box } from '../component/ui';

export class Bank extends Building {
    static res = ['building/bank.png'];
    static key = 'bank';
    item = 'building/bank.png';
    own = 0;
    name = 'DBO Bank';

    act_loan_pay = false;
    act_save_out = false;
    render(dt:number, t:number, cam:Camera):sprite[] {
        return [this.base(dt,t,cam), {
            f: 'building/bank.png',
            p: [[-62, -100],[],[133, 130],[]],
            m: [1,0,0,1,4,-32],
        }];
    }
    menu(dt:number, t:number, cam:Camera):sprite[] {
        let savings=economy.logs[0], loans=economy.logs[1];
        let max = Math.max(100,Math.max(...savings, ...loans));
        return [
            // Graph box between ([-135,-133],[],[270,70],[])
            ...box({x:0,y:-98}, cam, 19, 4, 2),
            { p: savings.length < 2 ? [[0,55],[270,55]] : savings.map((x,n)=>[270*n/(savings.length-1),55*(1-x/max)]), b:'green', x:-135, y:-125, bz:2, a:0.5 },
            { p: loans.length < 2 ? [[0,55],[270,55]] : loans.map((x,n)=>[270*n/(loans.length-1),55*(1-x/max)]), b:'red', x:-135, y:-125, bz:2, a:0.5 },
            // { p: [[-135,-125],[],[270,55],[]], f:'red', a:0.5 },

            // Savings Account
            { t:'Savings (5% rate)', o:'w', x:-140, y:-30, f:'black', tz:10, a:0.75 },
            { t:String(economy.saving), o:'w', x:-140, y:-10, f:'black', tz:15 },
            ...box({x:-100,y:15,t:'1,000',tz:15,f:'black',bz:0, click:s=>economy.saved(1000*(this.act_save_out?-1:1))}, cam, 5, 1),
            ...box({x:0,y:15,t:'10,000',tz:15,f:'black',bz:0, click:s=>economy.saved(10000*(this.act_save_out?-1:1))}, cam, 6, 1),
            ...box({x:100,y:15,t:'100k',tz:15,f:'black',bz:0, click:s=>economy.saved(100000*(this.act_save_out?-1:1))}, cam, 5, 1),
            ...box({x:90,y:-20,t:this.act_save_out?'deposit':'withdraw', tz:10,f:'black',bz:0, click:s=>this.act_save_out=!this.act_save_out}, cam, 6, 1),
            
            // Loans Account
            { t:'Loans (8% rate)', o:'w', x:-140, y:70, f:'black', tz:10, a:0.75 },
            { t:String(economy.loan), o:'w', x:-140, y:90, f:'black', tz:15 },
            ...box({x:-100,y:115,t:'1,000',tz:15,f:'black',bz:0, click:s=>economy.loaned(1000*(this.act_loan_pay?-1:1))}, cam, 5, 1),
            ...box({x:0,y:115,t:'10,000',tz:15,f:'black',bz:0, click:s=>economy.loaned(10000*(this.act_loan_pay?-1:1))}, cam, 6, 1),
            ...box({x:100,y:115,t:'100k',tz:15,f:'black',bz:0, click:s=>economy.loaned(100000*(this.act_loan_pay?-1:1))}, cam, 5, 1),
            ...box({x:90,y:80,t:this.act_loan_pay?'take loan':'pay back', tz:10,f:'black',bz:0, click:s=>this.act_loan_pay=!this.act_loan_pay}, cam, 6, 1),
        ];
    }
}

