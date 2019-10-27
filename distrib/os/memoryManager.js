/* ------------
    memoryManager.ts

     ------------ */
var TSOS;
(function (TSOS) {
    class MemoryManager {
        checkPartition(uPI) {
            var memory = 0;
            //check partition0
            if (_Memory.partition0) {
                //no more available memory
                memory = 257;
            }
            else {
                _Memory.partition0 = true;
                memory = 0;
            }
            //UPI will be store in memory
            for (var i = memory; i < uPI.length; i++) {
                _Memory.memorArr[i] = uPI[i];
            }
            TSOS.Control.updateMemDisplay(memory);
            return memory;
        }
        //get memory
        getMem(arr) {
            return _Memory.memorArr[arr];
        }
        //update memory
        updateMem(memAddress, d) {
            _Memory.memorArr[parseInt(memAddress, 16)] = d.toString(16);
        }
        //clear the memory display
        freeMem(memory) {
            for (var i = memory; i <= memory + 255; i++) {
                _Memory.memorArr[i] = "00";
            }
            if (memory == 0) {
                _Memory.partition0 = false;
            }
            TSOS.Control.updateMemDisplay(memory);
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map