# Power Editing
Power editing is an programmable graphics editor and program environment. 

also is an imitation version of Ronin editor, which is an editor that allows you to use edit photo by writing some codes.

* Download it from: https://ljcucc.itch.io/power-editing
* Online demo on :https://ljcucc.github.io/power-editing

## Feature
* Connect to our online sharing community platform
* Resizable code editor
* simple free data-type syntax
* using your codes as a plugins
* dragging view supported
* (and more features are developing!)

## Get Started 
Warning: only support on Mac OS, Windows and Linux will support soon.
* Docs on Google Sites: https://sites.google.com/view/power-editing

## Library
Basic syntax:
* `(let name value*)` Create a variable in current scope.
* `(= name value)` Set value to a variable in current scope.
* `(name)` call or get a function or value from variable.
* `(def name (...args*) (code))` define a function or create a async code object.

Calculations:
* `(+ ...args)` Addiction
* `(- ...args)` Subtraction
* `(* ...args)` Multiply
* `(/ ...args)` Division
* `(join ...strings)` Join strings together.
* `(== ...args)` fidn equals of values or and logic.

External Functions:
* `(date string)` String log with date
* `(date)` Get date string

Basic I/O
* `(msgbox string)`
* `(write string)`


## contribution
* Node.js 10 or higher
* npm
---
1. To start contribution, clone this project and run this command under `./desktop/` folder: `npm i`.
2. then type `npm start` to launch  application.
