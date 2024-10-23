import { Building } from '.';
import { Camera, sprite, Entity } from '../src/engine';
import { map_obj } from '../component/map';

/*
# Converting "blank_test.png" to "blank_mask.png"
convert blank_test.png -alpha on -channel a -fx 'a!=1?a:1-(r+g+b)/3' -channel rgb -fx '0' blank_mask.png
*/

export class Blank extends Building {
    static res = ['building/blank_mask.png'];
    static key = 'blank';
    item = 'building/blank_mask.png';
    own = 0;
    name = 'Private building';
    color:string[] = ['white','white','white'];
    render(dt:number, t:number, cam:Camera):sprite[] {
        let b = this.base(dt,t,cam);
        return [{x:b.x??0, y:b.y??0, c:b.c??1}, {
            p: [[-45,-33],[0,-7],[50,-20],[50,11],[0,24],[-38, 2],[-45,0],[]],
            f: this.color[0],
        }, {
            p: [[-45,-65],[0,-39],[50,-52],[50,-20],[0,-7],[-45,-33],[]],
            f: this.color[1],
        }, {
            p: [[-49,-69.5],[8,-85],[54,-58],[54,-54],[53,-53],[53,-50],[0,-36],[-47,-64],[-47,-65],[-49,-67],[]],
            f: this.color[2],
        }, {
            f: 'building/blank_mask.png',
            p: [[-48, -85],[],[102, 110],[]],
            m: [1,0,0,1,0,-30],
            ...b,
        }];
    }
    d = 100; // Color diversity
    constructor(map:Entity, x:number, y:number, m:map_obj) {
        super(map, x, y, m);
        if (m.color?.length == 3) this.color = m.color;
        else this.color = Array(3).fill('').map(_=>`rgb(${255-this.d+this.d*Math.random()},${255-this.d+this.d*Math.random()},${255-this.d+this.d*Math.random()})`);
    }
    menu(dt:number, t:number, cam:Camera):sprite[] {
        return [
            { t:'You cant own this', tz:15, a:0.5 },
        ];
    }
}

