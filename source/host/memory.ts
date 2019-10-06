/* ------------
    memory.ts

     ------------ */

module TSOS {

    export class Memory {
        //memory array
        public memorArr = [];
        //partition is free
        public partition0 = false;
    
        public init(): void {
            for (var i = 0; i < 256; i++){
                this.memorArr[i] = "00";
            }
        }
    
    }
}