import { sprite, Entity, Game } from './engine';
import { NobleCity } from './noblecity';


export class UI extends Entity {
    static res = [
        '/assets/coins.png'
    ];
    menu:boolean = false;
    render(game:NobleCity, dt:number, t:number):sprite[] {
        let popup = game.popup == this;
        let menubox = game.popup == this ? 
              [50, 50, game.w-100, game.h-100]
            : [game.w*0.25+50, 50, game.w*0.75-100, game.h-100];
        if (game.popup != null) {
            if (game.mouse.ab(1,0) && !game.mouse.over(menubox))
                game.popup = null;
        } else {
            if (game.mouse.ab(1,0) && game.mouse.over([game.w-28, 5, 23, 23]))
                game.popup = this;
        }
        return [
            // Animating Coin
            {   c: 0,
                f: UI.res[0],
                o: [Math.abs(2-Math.floor(t/100)%4)*22,0,22,23],
                d: 'nw',
                x: 5,
                y: 5
            },
            // Amount
            {   c: 0,
                t: String(game.coins),
                x: 35,
                y: 16,
                n: '18px Arial',
                d: 'w',
            },
            // Menu Bar
            {   c: 0,
                x: game.w-5,
                y: 5,
                d: 'ne',
                r: [-23,0,23,23],
                f: popup ? 'blue' : 'skyblue'
            },
            // Menu area
            ...(popup ? [
                // Dark screen
                {   c: 0,
                    r: [0,0,game.w,game.h],
                    f: 'black',
                    a: 0.75,
                },
                // Menu
                {   c: 0,
                    r: menubox,
                    f: 'gray',
                }
            ] : game.popup != null && game.popup instanceof Building ? [
                // Dark screen
                {   c: 0,
                    r: [0,0,game.w,game.h],
                    f: 'black',
                    a: 0.75,
                },
                // Menu
                {   c: 0,
                    r: menubox,
                    f: 'gray',
                },
                // Side pic
                {   c: 0,
                    x: game.w*0.1875,
                    y: game.h*0.5,
                    f: game.popup.popup_pic
                },
                // Title
                {   c:0,
                    x: game.w*0.25+70,
                    y: 60,
                    t: game.popup.popup_name
                }
            ] : []),
            
        ];
    }
}
export class Building extends Entity {
    popup_pic:string = "";
    popup_name:string = "";
}
export class Farm extends Building {
    static res = ['/assets/farm.png'];
    x:number = 0;
    y:number = 0; 
    popup_pic = Farm.res[0];
    popup_name = "Farm";
    render(game:NobleCity, dt:number, t:number):sprite[] {
        if (game.mouse.ab(1,0) && game.mouse.rover([-70+this.x, -50+this.y, 140, 100])) game.popup = this;
        return [
            {
                f: Farm.res[0],
                x: this.x,
                y: this.y,
            },
            // Hitbox
            {
                f: 'red',
                r: [-70, -50, 140, 100],
                a: 0,
            }
        ];
    }
}
export const list:(typeof Entity)[] = [
    UI, Farm,
];

/*
export class Coin extends Entity {
    static res = ['/assets/coins.png'];
    constructor(obj:sprite) {
        super();
        this.obj.push({
            f: Coin.res[0],
            o: [0,0,22,23],
            ...obj
        })
    }
    sprites(dt:number, t:number):sprite[] {
        if (this.obj[0].o) this.obj[0].o[0] = Math.abs(2-Math.floor(t/100)%4)*22;
        return this.obj;
    }
}
export class Factory extends Entity {
    static res = ['/assets/factory_new.png'];
    constructor() {
        super();
        this.obj.push({
            f: Factory.res[0]
        });
    }
    sprites(dt:number, t:number):sprite[] {
        return this.obj;
    }
}
export class Bank extends Entity {
    static res = ['/assets/bank.png'];
    constructor() {
        super();
        this.obj.push({
            f: Bank.res[0]
        });
    }
    sprites(dt:number, t:number):sprite[] {
        return this.obj;
    }
}
export class Building extends Entity {
    static res = ['/assets/building2.png', '/assets/building_side.png'];
    constructor() {
        super();
        this.obj.push({
            f: Building.res[0]
        });
    }
    sprites(dt:number, t:number):sprite[] {
        //this.obj.f = Building.res[Math.floor(t/500)%2];
        return this.obj;
    }
}
export class Tree extends Entity {
    static res = ['/assets/tree.png'];
    constructor() {
        super();
        this.obj.push({
            f: Tree.res[0]
        });
    }
    sprites(dt:number, t:number):sprite[] {
        return this.obj;
    }
}
export class Fishing extends Entity {
    static res = ['/assets/fishing.png'];
    constructor() {
        super();
        this.obj.push({
            f: Fishing.res[0]
        });
    }
    sprites(dt:number, t:number):sprite[] {
        return this.obj;
    }
}
export class Buildings extends Entity {
    static res = ['/assets/buildings.png'];
    constructor() {
        super();
        this.obj.push({
            f: Buildings.res[0]
        });
    }
    sprites(dt:number, t:number):sprite[] {
        return this.obj;
    }
}
export class Farm extends Entity {
    static res = ['/assets/farm.png'];
    constructor() {
        super();
        this.obj.push({
            f: Farm.res[0]
        });
    }
    sprites(dt:number, t:number):sprite[] {
        return this.obj;
    }
}
export const list:(typeof Entity)[] = [
    UI, Coin, Factory, Bank, Building, Tree, Fishing, Buildings, Farm
];*/