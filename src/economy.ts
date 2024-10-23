import { popup } from '.';
import { Building } from "../component/map";
import { Item } from '../item';

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
     * Day
     */
    day = 0;

    /**
     * Update logs
     */
    update() {
        let dt = performance.now()-this.last;
        if (dt < 1000) return;
        this.logs[0].push(this.saving);
        this.logs[1].push(this.loan);
        this.last = performance.now();
        this.logs[0] = this.logs[0].slice(-100);
        this.logs[1] = this.logs[1].slice(-100);
    }

    /**
     * User loans an amount
     */
    loaned(amount:number) {
        if (amount < 0 && this.money < -amount)
            return popup([{t:'Insufficent funds ', f:'#F44336', tz:15}]);
        if (this.loan > 100000)
            return popup([{t:'Reached Max loaned', f:'#F44336', tz:15}]);
        if (this.loan+amount > 100000) {
            popup([{t:'Reached Max loaned', f:'black', tz:15}]);
            amount = 100000-this.loan;
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
     * User purchases a building
     */
    purchase(build:Building) {
        if (this.money < build.price)
            return popup([{t:'Insufficent funds', f:'#F44336', tz:15}]);
        this.money -= build.price;
        build.own = 2;
        this.own.push(build);
    }
}
export let economy = new Economy();