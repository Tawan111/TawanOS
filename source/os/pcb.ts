///<reference path="../globals.ts" />

/* ------------
    pcb.ts

    Process Control Blocks

     ------------ */

module TSOS {

    export class Pcb {
    
        constructor(public pid: number = 0,
                    public pc: number = 0,
                    public ir: number = 0,
                    public acc: number = 0,
                    public x: number = 0,
                    public y: number = 0,
                    public z: number = 0,
                    public priority: number = 0,
                    public state: string = "Ready",
                    public location: string = "Memory") {

        }
                    
    }
}
