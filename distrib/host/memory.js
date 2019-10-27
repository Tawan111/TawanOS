/* ------------
    memory.ts

     ------------ */
var TSOS;
(function (TSOS) {
    class Memory {
        constructor() {
            //memory array
            this.memorArr = [];
            //partition is free
            this.partition0 = false;
        }
        init() {
            for (var i = 0; i < 256; i++) {
                this.memorArr[i] = "00";
            }
            //display the memory
            TSOS.Control.memDisplay();
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map