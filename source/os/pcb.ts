/* ------------
    pcb.ts

    Process Control Blocks

     ------------ */

module TSOS {

    export class Pcb {
            
        public pid: number;
        public state: string = "New";
        public pc: number = 0;
        public ir: string = "00";
        public acc: number = 0;
        public x: number = 0;
        public y: number = 0;
        public z: number = 0; 
        public location: string = "Memory";
        public pcb: number;
        public max: number;
    
        constructor(pcb, pid) {
            this.pcb = pcb;
            this.pid = pid;
            this.state = "New";
            this.max = pcb + 255;
        }
    }
}