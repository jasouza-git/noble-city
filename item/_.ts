import { Item } from '.';
import { Beef } from './beef';
import { Carrot } from './carrot';
import { Chicken } from './chicken';
import { Fertilizer } from './fertilizer';
import { Fish } from './fish';
import { Garlic } from './garlic';
import { Kadyos } from './kadyos';
import { Langka } from './langka';
import { Pork } from './pork';
import { Radish } from './radish';
import { Soup } from './soup';
import { Tomato } from './tomato';
import { Tuna } from './tuna';
import { Worm } from './worm';

// All Items
export let Items:typeof Item[] = [
    Fish,
    Beef,
    Carrot,
    Chicken,
    Fertilizer,
    Garlic,
    Kadyos,
    Langka,
    Pork,
    Radish,
    Soup,
    Tomato,
    Tuna,
    Worm,
];

export interface process {
    type:string,
    out:typeof Item[],
    in:typeof Item[],
    amount:number[],
    dur:number,
};
export interface process_session {
    id:number,
    in:Item[],
    out:Item[],
    amount:number[],
    dur:number, left:number,
    on:boolean,
    ongoing:boolean,
};
/**
 * Processes between items
 * - `type` - What type of building does this processing
 * - `in` - Input items
 * - `out` - Output items
 * - `amount` - Amount of input and output items
 * - `dur` - Duration to finish in days
 */
export let Process:process[] = [
    { type:'farm', in:[Fertilizer], out:[Carrot], amount:[1,20], dur:2 },
    { type:'farm', in:[Fertilizer], out:[Garlic], amount:[1,10], dur:1 },
    { type:'farm', in:[Fertilizer], out:[Kadyos], amount:[1,12], dur:2 },
    { type:'farm', in:[Fertilizer], out:[Tomato], amount:[1,10], dur:1 },
    { type:'farm', in:[Fertilizer], out:[Radish], amount:[1,10], dur:1 },
    { type:'farm', in:[Carrot,Tomato], out:[Pork], amount:[20,30,50], dur:3 },
    { type:'farm', in:[Tomato,Fish], out:[Chicken], amount:[10,5,40], dur:3 },
    { type:'fish', in:[Worm], out:[Fish], amount:[1,50], dur:1 },
    { type:'factory', in:[Fish], out:[Tuna], amount:[2], dur:1 },
    { type:'factory', in:[Tomato], out:[Soup], amount:[3,1], dur:1 },
    { type:'factory', in:[Garlic], out:[Soup], amount:[3,1], dur:1 },
];