///<reference path="../globals.ts" />
/* ------------
    memory.ts

     ------------ */
var TSOS;
(function (TSOS) {
    class Memory {
        constructor() {
            //memory array
            this.memory = [];
        }
        //creating empty memory
        init() {
            for (var i = 0; i < 256; i++) {
                this.memory[i] = "00";
            }
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map