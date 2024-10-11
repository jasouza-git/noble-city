# GGINE
**GGINE** *(gi-gine)* - Is a <u>G</u>raphics En<u>gine</u> madebwith typescript and to be compiled for browsers.

## Main file `engine.ts`
Contains the main engine, below are its exports:
- `sprite` *(interface)* - Is the fundamental rendering object of the engine, below are its properties:
  - **Positional** - Responsible for positioning the sprite
  - **Graphical** - Responsible for rendering the sprite
- `Entity` *(class)* - Is the base entity class for all entities
- `Engine` *(class)* - Is the base

## Solving
$$P\left(x,y\right)=\left[xz_{cam}^c+\frac{w}{2}cz_{cam}^{c-1}+x_{cam}(1-c-z_{cam}^c),yz_{cam}^c+\frac{h}{2}cz_{cam}^{c-1}+y_{cam}(1-c-z_{cam}^c)\right]\\
\\
x_{act}=x_{rel}z_{cam}^c+\frac{w}{2}cz_{cam}^{c-1}+x_{cam}(1-c-z_{cam}^c)\\
z_{cam}^c(x_{cam}-x_{rel})=\frac{w}{2}cz_{cam}^{c-1}+x_{cam}(1-c)-x_{act}\\
let\;c=1\\
z_{cam}(x_{cam}-x_{rel})=\frac{w}{2}-x_{act}\\
z_{cam}=\frac{\frac{w}{2}-x_{act}}{x_{cam}-x_{rel}}\\
\boxed{z_{cam}=\frac{w-2x_{act}}{2x_{cam}-2x_{rel}}}\\
wrong\;solving\;for\\
x_{act}=x_{rel}z_{cam}^c+\frac{w}{2}cz_{cam}^{c-1}+x_{cam}(1-c-z_{cam}^c)\\
x_{cam}(1-c-z_{cam}^c)=x_{act}-x_{rel}z_{cam}^c-\frac{w}{2}cz_{cam}^{c-1}\\
x_{cam}=\frac{x_{act}-x_{rel}z_{cam}^c-\frac{w}{2}cz_{cam}^{c-1}}{1-c-z_{cam}^c}\\
if\;c=1\\
x_{cam}=\frac{x_{rel}z_{cam}+\frac{w}{2}-x_{act}}{z_{cam}}\\
$$