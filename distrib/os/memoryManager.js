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
            return memory;
        }
        //get memory
        getMem(arr) {
            var data = _Memory.memorArr[arr];
            return data;
        }
        //update memory
        updateMem(memAddress, d) {
            var arr = parseInt(memAddress, 16);
            _Memory.memorArr[arr] = d.toString(16);
        }
        //clear the memory display
        freeMem(memory) {
            for (var i = memory; i <= memory + 255; i++) {
                _Memory.memorArr[i] = "00";
            }
            if (memory == 0) {
                _Memory.partition0 = false;
            }
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map