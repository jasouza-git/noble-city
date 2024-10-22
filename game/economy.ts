import { game } from "./noblecity";
import { Building } from "../entity/map";

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
     * How much savings does the user have right now
     */
    get saving():number {
        return this.savings[this.savings.length-1];
    }
    /**
     * How much loans does the user have right now
     */
    get loan():number {
        return this.loans[this.loans.length-1];
    }
    /**
     * History of savings
     */
    savings:number[] = [0];
    /**
     * History of loans
     */
    loans:number[] = [0];

    /**
     * User loans an amount
     */
    loaned(amount:number) {
        if (amount < 0 && this.money < -amount)
            return game.act('pop', [{t:'Insufficent funds ', f:'#F44336', tz:15}]);
        if (this.loan+amount > 100000)
            return game.act('pop', [{t:'Reached max loan', f:'#F44336', tz:15}]);
        this.money += amount;
        this.loans.push(this.loan+amount);
    }
    /**
     * User saves an amount
     */
    saved(amount:number) {
        if (amount < 0 && this.saving < -amount)
            return game.act('pop', [{t:'Insufficent savings ', f:'#F44336', tz:15}]);
        if (this.money < amount)
            return game.act('pop', [{t:'Insufficent funds', f:'#F44336', tz:15}]);
        this.money -= amount;
        this.savings.push(this.saving+amount);
    }
    /**
     * User purchases a building
     */
    purchase(build:Building) {
        if (this.money < build.price)
            return game.act('pop', [{t:'Insufficent funds', f:'#F44336', tz:15}]);
        this.money -= build.price;
        build.own = 2;
        this.own.push(build);
    }
}
export let economy = new Economy();