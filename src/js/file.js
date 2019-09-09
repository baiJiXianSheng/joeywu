
const array = [1, 2,3, 4],
    name = "peter";

let obj = {

    arr: [...array],

    print: () => console.log(this),

    name,

    context: `who is ${name}?`,

    generator: function * () {
        yield 1;
        yield 2;
        return this;
    },

    async: async function () {
        await this.generator();
    },

    promise: (fn) => new Promise((resolve, reject) => {
        setTimeout(() => {
           fn(); 
        }, 1000);
    }),

    symbol: new Symbol(),

    mapData: new Map(),

    setData: new Set(),

    classA: class A {
        constructor () {
            this._init()
        }

        _init () {
            console.log("class A is init!");
        }
    },

    setAttr: function () {
        Reflect.set(this, "name", "A sir")
    }

}