/* ------------
     memoryAccessor.ts
     
     ------------ */
var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() {
            //three partitions
            this.partition0 = false;
            this.partition1 = false;
            this.partition2 = false;
        }
        init() {
            //free partitions and update the memory display
            this.partition0 = false;
            this.partition1 = false;
            this.partition2 = false;
            TSOS.Control.memDisplay();
        }
        //find and read the partition
        findPart(part, max) {
            //TODO
        }
        //will write the partition
        usePart(part, arr, data) {
            //TODO
            TSOS.Control.updateMemDisplay(part);
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map