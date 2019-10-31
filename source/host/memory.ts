/* ------------
    memory.ts

     ------------ */

module TSOS {

    export class Memory {
        //memory array
        public memorArr = [];
        //all partitions are free
        public partition0 = false;
        public partition1 = false;
        public partition2 = false;
    
        public init(): void {
            for (var i = 0; i < 768; i++){
                this.memorArr[i] = "00";
            }
            //display the memory
            Control.memDisplay();
        }
    }
}