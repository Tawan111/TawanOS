/* ------------
    memory.ts

     ------------ */
var TSOS;
(function (TSOS) {
    class Memory {
        constructor() {
            //memory array
            this.memorArr = [];
            //all partitions are free
            this.partition0 = false;
            this.partition1 = false;
            this.partition2 = false;
        }
        init() {
            for (var i = 0; i < 768; i++) {
                this.memorArr[i] = "00";
            }
            //display the memory
            TSOS.Control.memDisplay();
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map