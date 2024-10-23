import { map_obj } from '../component/map';
export let map_data:map_obj[] = [
    {type:'sand', x:-10, y:-10, w:20, h:20},
    {type:'grass',x:-9, y:-9, w:18, h:18},
    {type:'fishing', x:7, y:9},
    {type:'dirt',x:3,y:-8,w:16,v:true},
    {type:'cement',x:-8,y:1,w:16},
    {type:'bank',x:2,y:0},
    {type:'tree',x:1.3,y:0.3},
    {type:'callereal', x:0, y:0},
    {type:'factory',x:-5,y:0},
    {type:'blank',x:5,y:0,color:['blue','brown','violet']},
    {type:'blank',x:4,y:0,color:['red','yellow','green']},
    {type:'bush',x:-2,y:0},
    {type:'farm',x:-2,y:0},
    {type:'tree',x:0,y:3},
    {type:'bush',x:-5,y:5},
    {type:'forest',x:-8,y:-8,w:10,h:10,d:0.5},
];

// Debugging
/*
for (let y = 0; y < 10; y++)
    for (let x = 0; x < 10; x++)
        map_data.push({type:'tree',x:-8+x*0.5+(Math.random()-0.5),y:-8+y*0.5+(Math.random()-0.5)});*/