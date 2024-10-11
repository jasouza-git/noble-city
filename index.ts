import { NobleCity } from './noblecity';
import { Coin, Factory, Bank, Building, Tree, Fishing, Buildings, Farm } from './entities';

let game = new NobleCity('#game');
game.load(Coin, Factory, Bank, Building, Tree, Fishing, Buildings, Farm);

let coin = new Coin({c:0,d:'ne',x:5,y:5});
let factory = new Factory();
let bank = new Bank();
bank.update({x:0});
let building = new Building();
building.update({x:100, y:-900});
let tree = new Tree();
tree.update({x:0});
let fish = new Fishing();
fish.update({x:-200});
let builds = new Buildings();
builds.update({x:-2000, y:-500});
let farm = new Farm();
farm.update({y:100});

game.add(factory, bank, building, tree, fish, builds, farm ,coin);
game.draw = (dt:number, t:number) => {
    game.sprites({
        f:'blue',
        r:[750,-500,800,1200]
    })
}