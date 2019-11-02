/* ------------
    cpuScheduler.ts

------------ */
var TSOS;
(function (TSOS) {
    class CpuScheduler {
        constructor() {
            //number of cycle for a program
            this.programCycle = 0;
        }
        run() {
            //running the first program
            this.programCycle = 0;
            var program = _RunningProcess.dequeue();
            //the state is changed to running
            program.state = "Running";
            //update the PCB table
            TSOS.Control.updatePcbTable(program.pid, program.state);
            _programPid = program.pid;
            _programLocation = program.pcb;
        }
        scheduler() {
            //the program cycle increments after each cycle
            this.programCycle++;
            //checks when the program cycle exceeds the quantum
            if (this.programCycle > quantum) {
                //initialize context switch if there is another program in the queue
                if (!_RunningProcess.isEmpty()) {
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CS_IRQ, _programPid));
                }
                else {
                    //when there is no other program, check if the current program is complete
                    if (_CPU.IR == "00") {
                        _CPU.init();
                    }
                }
                //when there is only one program, the program will continue to run, but when there are multiple programs, the cycle is reset in order to run the next program in queue
                this.programCycle = 0;
            }
        }
    }
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpuScheduler.js.map