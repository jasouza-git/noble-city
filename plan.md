### Sprite System
- Simple rectangle relative to camera
    ```js
    // rect points is relative to origin point
    {rect:[0,0,100,100], x:0, y:0, camera:0}
    ```
### Sprites properties
- `r:number[4]` - Specifies a rectangle relative to the origin
- `x:number` - X Position
- `y:number` - Y Position
- `z:number` - Scalled
- `c:number` - A number from 0 *(Fixed)* to 1 *(relative,default)*
- `f:string` - The filled texture of the shape *(color,image)*
- `b:string` - the border texture of the shape *(color,image)*
- `d:string` - Direction like n, sw, or center
