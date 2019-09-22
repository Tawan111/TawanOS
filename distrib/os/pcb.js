///<reference path="../globals.ts" />
/* ------------
    pcb.ts

    Process Control Blocks

     ------------ */
var TSOS;
(function (TSOS) {
    class Pcb {
        constructor(pid = 0, pc = 0, ir = 0, acc = 0, x = 0, y = 0, z = 0, priority = 0, state = "Ready", location = "Memory") {
            this.pid = pid;
            this.pc = pc;
            this.ir = ir;
            this.acc = acc;
            this.x = x;
            this.y = y;
            this.z = z;
            this.priority = priority;
            this.state = state;
            this.location = location;
        }
    }
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map