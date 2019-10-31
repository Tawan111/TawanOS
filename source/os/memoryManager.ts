/* ------------
    memoryManager.ts

     ------------ */

     module TSOS {

        export class MemoryManager {
            
            public checkPartition(uPI) {   

                var memory = 0;
                //check all partitions
                if (_Memory.partition0) {
                    if(_Memory.partition1) {
                        if(_Memory.partition2) {
                            //all partitions are taken
                            memory = 769;
                        } else {
                            //partition 2 is taken
                            _Memory.partition2 = true;
                            memory = 512;
                        }
                    } else {
                        //partition 1 is taken
                        _Memory.partition1 = true; 
                        memory = 256;
                    }
                       
                } else {
                    //partition 0 is taken
                    _Memory.partition0 = true;
                    memory = 0;
                }
                //if memory is not full
                if(memory != 769) {
                //UPI will be store in memory
                for (var i = 0; i <uPI.length; i++) {
                    _Memory.memorArr[memory + i] = uPI[i];
                    }  
                //the stored UPI will be updated in the memory display
                Control.updateMemDisplay(memory);
                }
                return memory;
            }
            //get memory
            public getMem(arr){
                //return value to cpu when fetch
                return _Memory.memorArr[_RunningProcess.q[0].pcb + arr];
                
            }
            //update memory
            public updateMem(memAddress, d): void {
                var program = _RunningProcess.dequeue();
                _RunningProcess.enqueue(program);
                _Memory.memorArr[parseInt(memAddress, 16) + program.pcb] = d.toString(16);
                //update the memory display
                Control.updateMemDisplay(0);
              
            }
            //clear the memory display
            public freeMem(memory): void {
                for (var i = memory; i <= memory + 255; i++){
                    _Memory.memorArr[i] = "00";
                } 
                if(memory == 0) {
                    //when memory partition 0 is empty, partition 0 is false
                    _Memory.partition0 = false;
                } else if(memory == 256) {
                    //when memory partition 1 is empty, partition 1 is false
                    _Memory.partition1 = false;
                } else {
                    //when memory partition 2 is empty, partition 2 is false
                    _Memory.partition2 = false;
                } 
                //update the memory display to remove the memory from the display 
                Control.updateMemDisplay(memory);
            }
            //clear all memory when user input clearmem
            public clearMem(): void{
                //set all partitions to false to free up the memory
                this.freeMem(0);
                _Memory.partition0 = false;

                this.freeMem(256);
                _Memory.partition1 = false;

                this.freeMem(512);
                _Memory.partition2 = false;

            }
        }
    }