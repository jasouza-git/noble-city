import { sprite, Entity } from './engine';

export class Coin extends Entity {
    static res = ['/src/coins.png'];
    constructor(obj:sprite) {
        super();
        this.update({
            f: Coin.res[0],
            o: [0,0,22,23],
        }, obj);
    }
    sprite(dt:number, t:number):sprite {
        if (this.obj.o) this.obj.o[0] = Math.abs(2-Math.floor(t/100)%4)*22;
        return this.obj;
    }
}
export class Factory extends Entity {
    static res = ['/src/factory_new.png'];
    constructor() {
        super();
        this.update({
            f: Factory.res[0]
        });
    }
    sprite(dt:number, t:number):sprite {
        return this.obj;
    }
}
export class Bank extends Entity {
    static res = ['/src/bank.png'];
    constructor() {
        super();
        this.update({
            f: Bank.res[0]
        });
    }
    sprite(dt:number, t:number):sprite {
        return this.obj;
    }
}
export class Building extends Entity {
    static res = ['/src/building2.png', '/src/building_side.png'];
    constructor() {
        super();
        this.update({
            f: Building.res[0]
        });
    }
    sprite(dt:number, t:number):sprite {
        //this.obj.f = Building.res[Math.floor(t/500)%2];
        return this.obj;
    }
}
export class Tree extends Entity {
    static res = ['/src/tree.png'];
    constructor() {
        super();
        this.update({
            f: Tree.res[0]
        });
    }
    sprite(dt:number, t:number):sprite {
        return this.obj;
    }
}
export class Fishing extends Entity {
    static res = ['/src/fishing.png'];
    constructor() {
        super();
        this.update({
            f: Fishing.res[0]
        });
    }
    sprite(dt:number, t:number):sprite {
        return this.obj;
    }
}
export class Buildings extends Entity {
    static res = ['/src/buildings.png'];
    constructor() {
        super();
        this.update({
            f: Buildings.res[0]
        });
    }
    sprite(dt:number, t:number):sprite {
        return this.obj;
    }
}
export class Farm extends Entity {
    static res = ['/src/farm.png'];
    constructor() {
        super();
        this.update({
            f: Farm.res[0]
        });
    }
    sprite(dt:number, t:number):sprite {
        return this.obj;
    }
}