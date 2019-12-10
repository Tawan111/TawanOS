/* ------------
    cpuScheduler.ts

------------ */
var TSOS;
(function (TSOS) {
    class CpuScheduler {
        constructor() {
            //number of cycle for a program
            this.programCycle = 0;
            this.schedule = "rr";
        }
        run() {
            //running the first program
            //cycle is set to 0 at the start
            this.programCycle = 0;
            this.program = _RunningProcess.dequeue();
            //the state is changed to running
            this.program.state = "Running";
            //cpu is running
            _CPU.isExecuting = true;
            //update the PCB table
            TSOS.Control.updatePcbTable(this.program.pid, this.program.state, "Memory");
            //remove the pid from the waiting pid array
            _PIDWaiting.splice(_PIDWaiting.indexOf(this.program.pid), 1);
            //add the pid to the running pid array
            _PIDRunning.push(this.program.pid);
        }
        //check the scheduler for RR
        scheduler() {
            //if theres no more program running
            if (_PIDAll.length == 0) {
                //cpu is reset
                _CPU.init();
            }
            else {
                //the program cycle increments after each cycle
                this.programCycle++;
                //checks when the program cycle exceeds the quantum
                if (this.programCycle >= _Quantum) {
                    //initialize context switch if there is another program in the queue
                    if (!_RunningProcess.isEmpty()) {
                        //call context switch
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CS_IRQ, this.program));
                    }
                }
            }
        }
    }
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpuScheduler.js.map