import { popup } from '.';
import { Building } from '../component/map';
import { Item } from '../item';
import { Items, process, Process, process_session } from '../item/_';

export class Economy {
    /**
     * How much money does the user have right now
     */
    money:number = 0;
    /**
     * Buildings the player owns
     */
    own:Building[] = [];
    /**
     * Items and Prices (Simulates )
     */
    items:Item[] = Items.map(x => new x());
    /**
     * The list of prices
     */
    item_prices:number[][] = [];
    /**
     * Quantity demanded
     */
    item_demand:number[] = [];
    /**
     * Items the player has
     */
    item:Item[] = [];
    /**
     * How much savings does the user have right now
     */
    saving:number = 0;
    /**
     * How much loans does the user have right now
     */
    loan:number = 0;
    /**
     * Records of savings and loans
     */
    logs:number[][] = [[],[]];
    last:number = 0;
    /**
     * Months left before Dinagyang
     */
    time = 40;

    /**
     * Update logs
     */
    update() {
        /*let dt = performance.now()-this.last;
        if (dt < 1000) return;
        this.logs[0].push(this.saving);
        this.logs[1].push(this.loan);
        this.last = performance.now();
        this.logs[0] = this.logs[0].slice(-100);
        this.logs[1] = this.logs[1].slice(-100);*/
    }
    /**
     * Get exact item
     */
    get_item(target:Item):Item|null {
        for (const i of this.item)
            if (i.constructor == target.constructor)
                return i;
        return null;
    }

    /**
     * User loans an amount
     */
    loaned(amount:number) {
        if (amount < 0 && this.money < -amount)
            return popup([{t:'Insufficent funds ', f:'#F44336', tz:15}]);
        if (this.loan > 100000 && amount > 0)
            return popup([{t:'Reached Max loaned', f:'#F44336', tz:15}]);
        if (this.loan+amount > 100000) {
            popup([{t:'Reached Max loaned', f:'black', tz:15}]);
            amount = 100000-this.loan;
        }
        if (amount < 0 && this.loan+amount <= 0) {
            popup([{t:'Fully paid loans', f:'black', tz:15}]);
            amount = this.loan;
        }
        this.money += amount;
        this.loan += amount;
    }
    /**
     * User saves an amount
     */
    saved(amount:number) {
        if (amount < 0 && this.saving < -amount)
            return popup([{t:'Insufficent savings ', f:'#F44336', tz:15}]);
        if (this.money < amount)
            return popup([{t:'Insufficent funds', f:'#F44336', tz:15}]);
        this.money -= amount;
        this.saving += amount;
    }
    /**
     * User purchases or sells a building
     */
    building(build:Building, buy:boolean) {
        if (!buy) {
            let n = 0;
            for (let b of this.own) {
                if (b == build) {
                    this.money += build.price;
                    build.price = Math.round(build.price*0.95);
                    build.own = 1;
                    this.own.splice(n, 1);
                    return;
                } else n++;
            }
            return popup([{t:'Failure', f:'#F44336', tz:15}]);
        }
        if (this.money < build.price)
            return popup([{t:'Insufficent funds', f:'#F44336', tz:15}]);
        this.money -= build.price;
        build.price = Math.round(build.price*0.95);
        build.own = 2;
        this.own.push(build);
    }
    /**
     * Buy or sell a product
     */
    product(i:Item, amount:number) {
        // Selling
        if (amount < 0) {
            let u = this.get_item(i);
            if (u == null) return popup([{t:'Cant afford', f:'#F44336', tz:15}]);
            if (u.quantity < -amount) return popup([{t:'Insufficent items', f:'#F44336', tz:15}]);
            this.money -= i.price*amount;
            u.quantity += amount;
            i.quantity -= amount;
            return;
        }
        // Buying
        if (this.money < i.price*amount)
            return popup([{t:'Cant afford', f:'#F44336', tz:15}]);
        if (i.quantity < amount)  return popup([{t:'Insufficent in stock', f:'#F44336', tz:15}]);
        for (const u of this.item) if (u.constructor == i.constructor) {
            this.money -= i.price*amount;
            u.quantity += amount;
            i.quantity -= amount;
            return;
        }
        popup([{t:'Unknown item', f:'#F44336', tz:15}]);
    }
    /**
     * Accept or decline a process
     */
    process(p:process_session):boolean {
        // Check if session already exists, then cancel it
        let ps = -1;
        if ((ps = this.processes.indexOf(p)) != -1) {
            if (p.ongoing == true) {
                popup([{t:'Cant cancel', f:'#F44336', tz:15}]);
                return false;
            }
            p.in.forEach((i,n) => {
                let t = this.get_item(i);
                if (t) t.quantity += p.amount[n];
            });
            this.processes.splice(ps, 1);
            return true;
        }
        // Check if sessions can be made
        for (let m = 0; m < p.in.length; m++) {
            let u = economy.get_item(p.in[m]);
            if (u == null) {
                popup([{t:'Unknown item', f:'#F44336', tz:15}]);
                return false;
            }
            if (u.quantity < p.amount[m]) {
                popup([{t:`Lacking ${u.name}`, f:'#F44336', tz:15}]);
                return false;
            }
        }
        // Session can be made
        for (let m = 0; m < p.in.length; m++) {
            let u = economy.get_item(p.in[m])!;
            u.quantity -= p.amount[m];
        }
        p.left = p.dur;
        this.processes.push(p);
        return true;
    }
    processes:process_session[] = [];


    /**
     * A month has passed
     */
    next() {
        if (this.time == 0) return;
        this.time--;
        if (this.time == 0) {
            let p = this.money+this.saving-this.loan;
            this.items.forEach(i => {
                let u = this.get_item(i);
                if (u == null) return;
                p += u.quantity*i.price;
            });
            this.own.forEach(b => {
                p += b.price;
            });
            this.points = p;
            this.end();
        }
        // Log
        this.logs[0].push(this.saving);
        this.logs[1].push(this.loan);
        // Update
        this.loan = Math.round(this.loan*(1 + 0.08 / 30));
        this.saving = Math.round(this.saving*(1 + 0.05 / 30));
        this.items.forEach((i,n) => {
            /*let ps = Process.filter(p => p.out.some(o => i.constructor == o));
            //i.price = 
            this.item_prices[n].push(i.price);*/
            let qs = Math.round(i.quantity/2+1.5*i.quantity*Math.random());
            i.price = Math.round(i.price+this.k*(this.item_demand[n]-qs)/i.quantity);
            i.quantity = Math.round(Math.max(100+(25-50*Math.random()),Math.round(i.quantity*2*Math.random())));
            this.item_prices[n].push(i.price);
        });
        // Processes
        for (const p of this.processes) {
            p.left--;
            if (p.left <= 0) {
                p.out.forEach((o,m) => {
                    let u = this.get_item(o);
                    if (u != null) u.quantity += p.amount[p.in.length+m];
                })
                p.ongoing = p.on = false;
                p.left = p.dur;
            } else p.ongoing = true;
        }
        this.processes = this.processes.filter(p => p.on);
    }
    k = 2; // Constant controlling how sensitive the price is to changes in demand and supply
    /**
     * Triggered when the player finishes the game
     */
    end:()=>void = ()=>{};
    win:boolean = false; // Player won?
    points:number = 0;

    /**
     * Initialize items
     */
    constructor() {
        this.items.forEach(i => {
            i.quantity = Math.round(500*Math.random()+1000*Math.random());
            this.item_prices.push([i.price]);
            this.item_demand.push(Math.round(i.quantity/2+1.5*i.quantity*Math.random()));
        });
    }
}
export let economy = new Economy();
for (let n = 0; n < 30; n++) economy.next();