///<reference path="../globals.ts" />

/* ------------
    memory.ts

     ------------ */

module TSOS {

    export class Memory {
       
        //memory array
        public memory = [];
        //creating empty memory
        public init(): void {
            for (var i = 0; i < 256; i++){
                this.memory[i] = "00";
            }
        }
    }
}