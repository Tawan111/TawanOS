/* ------------
     Kernel.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    class Kernel {
        //
        // OS Startup and Shutdown Routines
        //
        krnBootstrap() {
            TSOS.Control.hostLog("bootstrap", "host"); // Use hostLog because we ALWAYS want this, even if _Trace is off.
            // Initialize our global queues.
            _KernelInterruptQueue = new TSOS.Queue(); // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array(); // Buffers... for the kernel.
            _KernelInputQueue = new TSOS.Queue(); // Where device input lands before being processed out somewhere.
            _NewProcess = new TSOS.Queue(); //new processes that are loaded
            _RunningProcess = new TSOS.Queue(); //processes that will run
            // Initialize the console.
            _Console = new TSOS.Console(); // The command line interface / console I/O device.
            _Console.init();
            // Initialize standard input and output to the _Console.
            _StdIn = _Console;
            _StdOut = _Console;
            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new TSOS.DeviceDriverKeyboard(); // Construct it.
            _krnKeyboardDriver.driverEntry(); // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);
            //launching memory manager and cpu scheduler
            _MemoryManager = new TSOS.MemoryManager();
            _CpuScheduler = new TSOS.CpuScheduler();
            //
            // ... more?
            //
            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();
            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new TSOS.Shell();
            _OsShell.init();
            // Finally, initiate student testing protocol.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        }
        krnShutdown() {
            this.krnTrace("begin shutdown OS");
            // TODO: Check for running processes.  If there are some, alert and stop. Else...
            // ... Disable the Interrupts.
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();
            //
            // Unload the Device Drivers?
            // More?
            //
            _CPU.isExecuting = false;
            this.krnTrace("end shutdown OS");
        }
        krnOnCPUClockPulse() {
            /* This gets called from the host hardware simulation every time there is a hardware clock pulse.
               This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
               This, on the other hand, is the clock pulse from the hardware / VM / host that tells the kernel
               that it has to look for interrupts and process them if it finds any.
            */
            // Check for an interrupt, if there are any. Page 560
            if (_KernelInterruptQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                // TODO (maybe): Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            }
            else if (_CPU.isExecuting) { // If there are no interrupts then run one CPU cycle if there is anything being processed.
                _CPU.cycle();
                //update the cpu display
                TSOS.Control.cpuDisplay();
                //check if the program is complete
                if (_CPU.IR !== "00") {
                    //update the pcb display if the program still have to run
                    TSOS.Control.updatePcbTable(_CpuScheduler.program.pid, _CpuScheduler.program.state);
                }
                //check the scheduler for RR
                _CpuScheduler.scheduler();
            }
            else { // If there are no interrupts and there is nothing being executed then just be idle.
                this.krnTrace("Idle");
            }
        }
        //
        // Interrupt Handling
        //
        krnEnableInterrupts() {
            // Keyboard
            TSOS.Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        }
        krnDisableInterrupts() {
            // Keyboard
            TSOS.Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        }
        krnInterruptHandler(irq, params) {
            // This is the Interrupt Handler Routine.  See pages 8 and 560.
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on. Page 766.
            this.krnTrace("Handling IRQ~" + irq);
            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR(); // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params); // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case INVALID_IRQ: //program error
                    this.UpiInvalid(params);
                    break;
                case OUTPUT_IRQ: //program result
                    this.output(params);
                    break;
                case CS_IRQ: //context switch will be called by scheduler
                    this.contextSwitch(params);
                    break;
                case Bounds_IRQ: //memory out of bounds error
                    this.memViolation(params);
                    break;
                case KILL_IRQ: //kill a program
                    this.kill(params);
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        }
        krnTimerISR() {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
            // Or do it elsewhere in the Kernel. We don't really need this.
        }
        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        // Some ideas:
        // - ReadConsole
        // - WriteConsole
        // - CreateProcess
        // - ExitProcess
        // - WaitForProcessToExit
        // - CreateFile
        // - OpenFile
        // - ReadFile
        // - WriteFile
        // - CloseFile
        //
        // OS Utility Routines
        //
        krnTrace(msg) {
            // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
            if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would quickly lag the browser quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        TSOS.Control.hostLog(msg, "OS");
                    }
                }
                else {
                    TSOS.Control.hostLog(msg, "OS");
                }
            }
        }
        krnTrapError(msg) {
            TSOS.Control.hostLog("OS ERROR - TRAP: " + msg);
            // TODO: Display error on console, perhaps in some sort of colored screen. (Maybe blue?)
            this.krnShutdown();
            //Stop the interval of clock pulse.
            clearInterval(_hardwareClockID);
            //using the canvas' Id in order to fill the whole canvas with a color
            var canvasDisplay = document.getElementById("display");
            var bsodImage = canvasDisplay.getContext("2d");
            //fillStyle for chosen color
            bsodImage.fillStyle = "blue";
            //fillRect using the canvas' width and height
            bsodImage.fillRect(0, 0, 500, 500);
        }
        //new program will be created with a unique pid
        newProg(pid) {
            //pid incrementally increase
            _PID++;
            //give the program a pid value
            var program = new TSOS.Pcb(pid, _PID);
            _NewProcess.enqueue(program);
            //add the pid to the waiting pid array
            _PIDWaiting.push(program.pid);
            //print pcb table
            TSOS.Control.makePcbTable(program);
            //return the new pid
            return _PID;
        }
        //comeplete the program and free memory
        completeProg(program) {
            //free memory base on the program location in memory
            _MemoryManager.freeMem(_CpuScheduler.program.pcb);
            //clear the program from pcb display
            TSOS.Control.clearPcbTable(_CpuScheduler.program.pid);
            //remove the pid from the all pid array
            _PIDAll.splice(_PIDAll.indexOf(_CpuScheduler.program.pcb.pid), 1);
            //remove the pid from the running pid array
            _PIDRunning.splice(_PIDRunning.indexOf(_CpuScheduler.program.pcb.pid), 1);
            //check for anymore running program
            if (_PIDAll.length == 0) {
                //call scheduler
                _CpuScheduler.scheduler();
            }
            else {
                //the program cycle is = to the set quantum
                _CpuScheduler.programCycle = _Quantum;
            }
        }
        //kill a program
        kill(pid) {
            var program;
            //pid searched from running programs
            var value = _PIDAll.indexOf(parseInt(pid));
            //check for pid
            if (value == -1) {
                //pid doesnt exist
                _StdOut.putText("PID: " + pid + " not found.");
                _StdOut.advanceLine();
            }
            else {
                //matach input pid with program pid
                if (pid == _CpuScheduler.program.pid) {
                    //complete the program
                    this.completeProg(_CpuScheduler.program);
                }
                else {
                    //look for memory location for running programs
                    for (var i = 0; i < _RunningProcess.getSize(); i++) {
                        program = _RunningProcess.dequeue();
                        if (program.pid == pid) {
                            //memory location
                            var pcb = program.pcb;
                            break;
                        }
                        else {
                            _RunningProcess.enqueue(program);
                        }
                    }
                }
                //update pcb table after removal
                TSOS.Control.clearPcbTable(pid);
                //free memory of the running program
                _MemoryManager.freeMem(pcb);
                //remove the pid from the all pid array
                _PIDAll.splice(value, 1);
                //call scheduler
                _CpuScheduler.scheduler();
            }
        }
        //invalid op code detected
        UpiInvalid(opCode) {
            _StdOut.putText("Invalid op code: " + opCode);
            _StdOut.advanceLine();
            _OsShell.putPrompt();
        }
        //print out memory viloation error when detected manager
        memViolation(pid) {
            _StdOut.putText("Memory access violation from PID: " + pid);
            //complete the program
            this.completeProg(_CpuScheduler.program);
        }
        //output on the canvas
        output(chr) {
            _StdOut.putText(chr);
        }
        //run a program
        runProg(pid) {
            var program;
            var order = false;
            //pid condition
            var checkPid = false;
            //search for the pid
            for (var i = 0; i < _NewProcess.getSize(); i++) {
                program = _NewProcess.dequeue();
                //if the pid match
                if (program.pid == pid) {
                    //condition is set to true
                    checkPid = true;
                    break;
                }
                _NewProcess.enqueue(program);
                //changing the order of the programs in queue
                order = !order;
            }
            //run the program if it is found
            if (checkPid) {
                if (order) {
                    _NewProcess.enqueue(_NewProcess.dequeue());
                }
                //change the program state to waiting
                program.state = "Waiting";
                //add pid to the all pid array
                _PIDAll.push(program.pid);
                _RunningProcess.enqueue(program);
                //update the pcb table
                TSOS.Control.updatePcbTable(program.pid, program.state);
                //if cpu is already running, check the cpu scheduler and set program cycle to equal to quantum
                if (_CPU.isExecuting == true) {
                    _CpuScheduler.scheduler();
                    _CpuScheduler.programCycle = _Quantum;
                }
                else {
                    //call the scheduler to run the program
                    _CpuScheduler.run();
                }
            }
            else {
                //if the pid is not found
                _StdOut.putText("PID: " + pid + " does not exist");
                _StdOut.advanceLine();
            }
        }
        //run all proceses
        runAllProg() {
            var program;
            //check if theres program loaded
            while (!_NewProcess.isEmpty()) {
                program = _NewProcess.dequeue();
                //add pid to the all pid array
                _PIDAll.push(program.pid);
                //change the state to new
                program.state = "New";
                _RunningProcess.enqueue(program);
                //update the pcb table
                TSOS.Control.updatePcbTable(program.pid, program.state);
            }
            //call the scheduler to run the program
            _CpuScheduler.run();
        }
        //switch between programs
        contextSwitch(program) {
            //if the current program is not complete, it will be saved 
            if (_CPU.IR != "00") {
                var runningProgram = new TSOS.Pcb(_CpuScheduler.program.pcb, _CpuScheduler.program.pid);
                //chnage the program state from running to waiting
                runningProgram.state = "Waiting";
                //save pc to cpu
                runningProgram.pc = _CPU.PC;
                //save acc to cpu
                runningProgram.acc = _CPU.Acc;
                //save xreg to cpu
                runningProgram.x = _CPU.Xreg;
                //save yreg to cpu
                runningProgram.y = _CPU.Yreg;
                //save zflag to cpu
                runningProgram.z = _CPU.Zflag;
                //remove the pid from the running pid array
                _PIDRunning.splice(_PIDRunning.indexOf(runningProgram.pid), 1);
                //add the pid to the waiting pid array
                _PIDWaiting.push(runningProgram.pid);
                _RunningProcess.enqueue(runningProgram);
                //update to the pcb display
                TSOS.Control.updatePcbTable(runningProgram.pid, runningProgram.state);
            }
            //program in queue is loaded
            var queueProgram = _RunningProcess.dequeue();
            //change the program state from waiting to running
            queueProgram.state = "Running";
            //updating pc
            _CPU.PC = queueProgram.pc;
            //updating acc
            _CPU.Acc = queueProgram.acc;
            //updating xreg
            _CPU.Xreg = queueProgram.x;
            //updating yreg
            _CPU.Yreg = queueProgram.y;
            //updating zflag
            _CPU.Zflag = queueProgram.z;
            _CpuScheduler.program = queueProgram;
            //remove the pid from the waiting pid array
            _PIDWaiting.splice(_PIDWaiting.indexOf(queueProgram.pid), 1);
            //add the pid to the running pid array
            _PIDRunning.push(queueProgram.pid);
            //reset the cycle
            _CpuScheduler.programCycle = 0;
        }
    }
    TSOS.Kernel = Kernel;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=kernel.js.map