/* ------------
    cpuScheduler.ts

------------ */

module TSOS {

    export class CpuScheduler {
        
        //number of cycle for a program
        public programCycle = 0;
        public program;
        //current schedule
        public schedule = "rr"
        //message for setschedule
        public schedulePrint;

        public run(): void {
            //running the first program
            //cycle is set to 0
            this.programCycle = 0;
            this.program = _RunningProcess.dequeue();
            //swap running program in disk with the next program in memory
            //if the current running program is in disk 
            if (this.program.pcb == 769) {
                var disk = _RunningProcess.dequeue();
                while(disk.pcb == 769) {
                    _RunningProcess.enqueue(disk);
                    disk = _RunningProcess.dequeue;
                }
                //put the program back in disk
                if (_Swapper.swapper(this.program.tsb, disk.pcb, disk.max)) {  
                    this.program.pcb = disk.pcb;
                    this.program.max = disk.max;
                    disk.tsb = _Swapper.swapper(this.program.tsb, disk.pcb, disk.max);
                    disk.pcb = 769;
                    _RunningProcess.enqueue(disk);
                } else {
                //no more disk space and memory
                var full: any = "No more space in memory or disk"
                _KernelInterruptQueue.enqueue(new Interrupt(INVALID_IRQ, full));
                //complete the program
                _Kernel.completeProg(_CpuScheduler.program);
                //cpu reset
                _CPU.init();
                }
            }
            //the state is changed to running
            this.program.state = "Running";
            //cpu is running
            _CPU.isExecuting = true;
            //update the PCB table
            Control.updatePcbTable(this.program.pid, this.program.state, "Memory");
            //remove the pid from the waiting pid array
            _PIDWaiting.splice(_PIDWaiting.indexOf(this.program.pid), 1);
            //add the pid to the running pid array
            _PIDRunning.push(this.program.pid);
        }
        //check the scheduler for RR
        public scheduler(): void {
            //if theres no more program running
            if (_PIDAll.length == 0) {
                //cpu is reset
                _CPU.init();
            } else {
                //the program cycle increments after each cycle
                this.programCycle++;
                //checks when the program cycle exceeds the quantum
                if (this.programCycle >= _Quantum){
                    //initialize context switch if there is another program in the queue
                    if (!_RunningProcess.isEmpty()){
                        //call context switch
                        _KernelInterruptQueue.enqueue(new Interrupt(CS_IRQ, this.program));
                    }
                }
            }
        }
        //change schedule
        public setSchedule(args): void {
            var schedule = args.toString();
            switch (schedule) {
                //round robin
                case "rr":
                    this.roundRobin();
                    break;
                //first come first serve
                case "fcfs":
                    this.firstComeFirstServe();
                    break;
                //priority
                case "priority":
                    this.priority();
                    break;
                //invalid input
                default:
                    _Quantum = 6;
                    this.schedulePrint = "Please input rr, fcfs, or priority";
                    break;
            }
            return this.schedulePrint;
        }
        //rr
        public roundRobin() {
            this.schedule = "RR";
            //quantum changed to 6
            _Quantum = 6;
            this.schedulePrint = "Schedule is now Round Robin";
        }
        //fcfs
        public firstComeFirstServe() {
            this.schedule = "FCFS"
            //quantum changed to 1000
            _Quantum = 1000;
            this.schedulePrint = "Schedule is now First Come First Serve";
        }
        //priority
        public priority() {
            this.schedule = "Priority";
            //quantum changed to 1000
            _Quantum = 1000;
            this.schedulePrint = "Schedule is now Priority";
        }
    }
}