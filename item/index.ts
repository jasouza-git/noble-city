import { Entity, sprite, Camera } from '../src/engine';

/**
 * 
 */
export class Item extends Entity {
    /* ----- FUNDAMENTAL PROPERTIES ---- */
    /**
     * Name of item
     */
    name:string = '';
    /**
     * Quantity of items
     */
    quantity:number = 0;
    /**
     * Price of a single item
     */
    price:number = 0;
    /**
     * Base sprite for the relatively drawn building
     * @param dt - Delta-time
     * @param t - Time
     * @param cam - Camera
     * @param s - If you already have a prefered scale and dont want it overwritten, put it here to act has the default scale coefficient
     * @returns - The base sprite, put it has the first sprite in the render output
     */
    base(dt:number, t:number, cam:Camera, s:number=1):sprite { // Base sprite for position and events
        return {
            c: 0,
        };
    }
    /**
     * Renders interface for when the building is on focus
     */
    menu(dt:number, t:number, cam:Camera):sprite[] {
        return [];
    }
    constructor() {
        super();
        //this.x = x*72+y*64;
        //this.y = y*36-x*19;
    }
}