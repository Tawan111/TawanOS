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
                return memory;
            }
            //get memory
            public getMem(arr){
                var data = _Memory.memorArr[arr];
                return data;
            }
            //update memory
            public updateMem(memAddress, d): void {
                var arr = parseInt(memAddress, 16);  
                _Memory.memorArr[arr] = d.toString(16);
              
            }
            //clear the memory display
            public freeMem(memory): void {
                for (var i = memory; i <= memory + 255; i++){
                    _Memory.memorArr[i] = "00";
                } 
                if(memory==0) {
                    _Memory.partition0 = false;
                } 
            }
        }
    }