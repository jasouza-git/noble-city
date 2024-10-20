import { Engine, Camera, Scene, Entity, sprite } from '../engine.ts';

class Menu extends Entity {
    static res = ['bg.jpg'];
    menu = 0;
    render(dt:number, t:number, cam:Camera):sprite[] {
        return [{},
            {
                c: 0,
                f: 'bg.jpg',
                o: 'nw',
                s: 0.135,
                p: [
                    [100, 100], [],
                    [100, 100], []
                ],
                b: 'red',
                hover: s => s.b = 'blue',
                click: s => this.menu = 1,
            }
        ]
    }
}

let game = new Engine;
game.base = '/assets/miming/';
let cam = new Camera('#game', game, 620, 360);
let menu = new Menu;
let home_menu = new Scene(game, menu);

game.load(p => {
    if (p == 1) home_menu.show();
}, Menu);