/* ------------
    memoryManager.ts

     ------------ */

     module TSOS {

        export class MemoryManager {
            
            public checkPartition(uPI) {   

                var memory = 0;
                //check partition0
                if (_Memory.partition0){
                    //no more available memory
                    memory = 257;
                       
                } else {
                    _Memory.partition0 = true;
                    memory = 0;
                }
                
                //UPI will be store in memory
                for (var i = memory; i <uPI.length; i++) {
                    _Memory.memorArr[i] = uPI[i];
                }  
                _Memory.updateMemDisplay(memory);
                return memory;
            }
            //get memory
            public getMem(arr){
                return _Memory.memorArr[arr];
            }
            //update memory
            public updateMem(memAddress, d): void {
                _Memory.memorArr[parseInt(memAddress, 16)] = d.toString(16);
              
            }
            //clear the memory display
            public freeMem(memory): void {
                for (var i = memory; i <= memory + 255; i++){
                    _Memory.memorArr[i] = "00";
                } 
                if(memory == 0) {
                    _Memory.partition0 = false;
                } 
                _Memory.updateMemDisplay(memory);
            }
        }
    }