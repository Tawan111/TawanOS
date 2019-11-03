/* ------------
    memoryManager.ts

     ------------ */
var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor() {
            //memory base location
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
                        //memory base location is 512
                        this.memory = 512;
                    }
                }
                else {
                    //partition 1 is taken
                    _Memory.partition1 = true;
                    //memory base location is 256
                    this.memory = 256;
                }
            }
            else {
                //partition 0 is taken
                _Memory.partition0 = true;
                //memory base location is 0
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
            //check for memory out of bonds error
            if ((_CpuScheduler.program.pcb + arr) > (_CpuScheduler.program.pcb + 255)) {
                //kernel interrupt memory access violation
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(Bounds_IRQ, _CpuScheduler.program.pid));
            }
            else {
                var value = _Memory.memorArr[_CpuScheduler.program.pcb + arr];
                return value;
            }
        }
        //update memory
        updateMem(memAddress, d) {
            //check for memory out of bonds error
            if ((parseInt(memAddress, 16) + _CpuScheduler.program.pcb) > (_CpuScheduler.program.pcb + 255)) {
                //kernel interrupt memory access violation
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(Bounds_IRQ, _CpuScheduler.program.pid));
            }
            else {
                _Memory.memorArr[parseInt(memAddress, 16) + _CpuScheduler.program.pcb] = d.toString(16);
                //update the memory display
                TSOS.Control.updateMemDisplay(_CpuScheduler.program.pcb);
            }
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
        //clear all memory when user input clearmem or killall
        clearMem() {
            //set all partitions to false to free up the memory
            this.freeMem(0);
            //free partition 0
            _Memory.partition0 = false;
            this.freeMem(256);
            //free partition 1
            _Memory.partition1 = false;
            this.freeMem(512);
            //free partition 2
            _Memory.partition2 = false;
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map