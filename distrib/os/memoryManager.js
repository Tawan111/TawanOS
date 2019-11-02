/* ------------
    memoryManager.ts

     ------------ */
var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor() {
            this.memory = 0;
        }
        checkPartition(uPI) {
            //check all partitions
            if (_Memory.partition0) {
                if (_Memory.partition1) {
                    if (_Memory.partition2) {
                        //all partitions are taken
                        this.memory = 769;
                    }
                    else {
                        //partition 2 is taken
                        _Memory.partition2 = true;
                        this.memory = 512;
                    }
                }
                else {
                    //partition 1 is taken
                    _Memory.partition1 = true;
                    this.memory = 256;
                }
            }
            else {
                //partition 0 is taken
                _Memory.partition0 = true;
                this.memory = 0;
            }
            //if memory is not full
            if (this.memory != 769) {
                //UPI will be store in memory
                for (var i = 0; i < uPI.length; i++) {
                    _Memory.memorArr[this.memory + i] = uPI[i];
                }
                //the stored UPI will be updated in the memory display
                TSOS.Control.updateMemDisplay(this.memory);
            }
            return this.memory;
        }
        //get memory
        getMem(arr) {
            //return location value to cpu when fetch
            return _Memory.memorArr[_programLocation + arr];
        }
        //update memory
        updateMem(memAddress, d) {
            _Memory.memorArr[parseInt(memAddress, 16) + _programLocation] = d.toString(16);
        }
        //clear the memory display
        freeMem(memory) {
            for (var i = memory; i <= memory + 255; i++) {
                _Memory.memorArr[i] = "00";
            }
            if (memory == 0) {
                //when memory partition 0 is empty, partition 0 is false
                _Memory.partition0 = false;
            }
            else if (memory == 256) {
                //when memory partition 1 is empty, partition 1 is false
                _Memory.partition1 = false;
            }
            else {
                //when memory partition 2 is empty, partition 2 is false
                _Memory.partition2 = false;
            }
            //update the memory display to remove the memory from the display 
            TSOS.Control.updateMemDisplay(memory);
        }
        //clear all memory when user input clearmem
        clearMem() {
            //set all partitions to false to free up the memory
            this.freeMem(0);
            _Memory.partition0 = false;
            this.freeMem(256);
            _Memory.partition1 = false;
            this.freeMem(512);
            _Memory.partition2 = false;
        }
        //TODO base and limit 
        baseLimit(base) {
            if (this.memory == 0) {
                this.base = 0;
                this.limit = "FF";
                return this.base;
            }
            if (this.memory == 256) {
                this.base = 100;
                this.limit = "1FF";
                return this.base;
            }
            if (this.memory == 512) {
                this.base = 200;
                this.limit = "2FF";
                return this.base;
            }
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map