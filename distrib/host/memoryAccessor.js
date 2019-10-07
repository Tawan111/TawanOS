/* ------------
     memoryAccessor.ts
     
     ------------ */
var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() {
            //three partitions for next project
            this.partition0 = false;
            this.partition1 = false;
            this.partition2 = false;
        }
        init() {
            //free partitions and update the memory display
            this.partition0 = false;
            this.partition1 = false;
            this.partition2 = false;
            _Memory.memDisplay();
        }
        //find and read the partition
        findPart(part, max) {
            //TODO
        }
        //will write the partition
        usePart(part, arr, data) {
            //TODO
            _Memory.updateMemDisplay(part);
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map