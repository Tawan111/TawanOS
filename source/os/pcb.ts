/* ------------
    pcb.ts

    Process Control Blocks

     ------------ */

module TSOS {

    export class Pcb {
        //values that will be display are pid, state, pc, ir, acc, x, y, z, location, base, and limit  
        public pid: number;
        public state: string = "New";
        public pc: number = 0;
        public ir: string = "00";
        public acc: number = 0;
        public x: number = 0;
        public y: number = 0;
        public z: number = 0; 
        public location: string = "Memory";
        public base: number = 0;
        public limit: string = "0";
        public pcb: number;
        public max: number;
    
        constructor(pcb, pid) {
            this.pcb = pcb;
            this.pid = pid;
            this.state = "New";
            this.max = 255;
        }
    }
}