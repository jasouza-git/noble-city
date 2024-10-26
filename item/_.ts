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
    { type:'farm', in:[Fertilizer], out:[Carrot], amount:[10,20], dur:2 },
    { type:'farm', in:[Fertilizer], out:[Garlic], amount:[10,15], dur:1 },
    { type:'farm', in:[Fertilizer], out:[Kadyos], amount:[10,25], dur:2 },
    { type:'farm', in:[Fertilizer], out:[Tomato], amount:[10,15], dur:1 },
    { type:'farm', in:[Fertilizer], out:[Langka], amount:[10,15], dur:1 },
    { type:'farm', in:[Fertilizer], out:[Radish], amount:[10,17], dur:1 },
    { type:'farm', in:[Carrot,Fish], out:[Pork], amount:[20, 30, 70], dur:3 },
    { type:'farm', in:[Tomato,Worm], out:[Chicken], amount:[5,10,30], dur:2 },
    { type:'fish', in:[Langka], out:[Worm], amount:[5,12], dur:1 },
    { type:'fish', in:[Worm], out:[Fish], amount:[10,20], dur:1 },
    { type:'factory', in:[Fish], out:[Tuna], amount:[50,50], dur:1 },
    { type:'factory', in:[Tomato, Garlic, Carrot], out:[Soup], amount:[15,5,10,30], dur:1 },
    { type:'factory', in:[Tomato, Garlic, Radish], out:[Soup], amount:[15,5,10,35], dur:1 },
];