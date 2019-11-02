/* ------------
    pcb.ts

    Process Control Blocks

     ------------ */
var TSOS;
(function (TSOS) {
    class Pcb {
        constructor(pcb, pid) {
            this.state = "Waiting";
            this.pc = 0;
            this.ir = "00";
            this.acc = 0;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.location = "Memory";
            this.base = 0;
            this.pcb = pcb;
            this.pid = pid;
            this.state = "Waiting";
            this.max = 255;
        }
    }
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map