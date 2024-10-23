import { Entity, sprite, Camera } from '../src/engine';

export class Person extends Entity {
    /* ----- FUNDAMENTAL PROPERTIES ---- */
    /**
     * Name of person
     */
    name:string = '';
    /**
     * Message of the person and their state
     */
    msg:[string,number][] = [];
    /**
     * Chat Text
     */
    get chat_txt():string { return this.msg.length ? this.msg[0][0] : ''; }
    get chat_num():number { return this.msg.length ? this.msg[0][1] : 0; }
    next():void {
        this.msg.shift();
    }
    /**
     * Renders interface for when the building is on focus
     */
    menu(dt:number, t:number, cam:Camera):sprite[] {
        return [];
    }
    render(dt: number, t: number, cam: Camera):sprite[] {
        return [];
    }
}