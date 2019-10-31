/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public IR: string = "00", 
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.IR = "00"; 
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            //run the program
            var program;

            if(this.PC == 0){
                program = _ReadyProcess.dequeue();
                //change the program state to running
                //move the program from ready to running
                program.state = "Running";
                _RunningProcess.enqueue(program);
                //update the pcb table
                Control.updatePcbTable(program.pid,
                                       this.PC, 
                                       this.IR, 
                                       this.Acc, 
                                       this.Xreg, 
                                       this.Yreg, 
                                       this.Zflag);
            }
            //retrieve code from memory
            var memoryOutput = this.retrieve(this.PC);
            this.IR = memoryOutput;
            this.executeProg(memoryOutput);   
            //transfer output to the cpu display
            Control.cpuDisplay();
            if(this.isExecuting){
                Control.updatePcbTable(program.pid,
                                       this.PC, 
                                       this.IR, 
                                       this.Acc, 
                                       this.Xreg, 
                                       this.Yreg, 
                                       this.Zflag);
            }
        }
        //will fetch from memory manager
        public retrieve(ProgC) {
            return _MemoryManager.getMem(ProgC);

        }
        //switch statement for op codes
        public executeProg(opCode) {
            if (opCode.length > 0) {
                switch (opCode) {
                    case "A9":
                        this.loadAccConst();
                        break;
                    case "AD":
                        this.loadAccMem();
                        break;
                    case "8D":
                        this.storeAccMem();
                        break;
                    case "6D":
                        this.addWithCarry();
                        break;
                    case "A2":
                        this.loadXregWithConst();
                        break;
                    case "AE":
                        this.loadXregFromMem();
                        break;
                    case "A0":
                        this.loadYregWithConst();
                        break;
                    case "AC":
                        this.loadYregFromMem();
                        break;
                    case "EA":
                        this.noOp();
                        break;
                    case "00":
                        this.break();
                        break;
                    case "EC":
                        this.compareMemToXreg();
                        break;
                    case "D0":
                        this.branchNBytes();                 
                        break;
                    case "EE":
                        this.increByte();
                        break;
                    case "FF":
                        this.systemCall();
                        break;
                    default:
                        _KernelInterruptQueue.enqueue(new Interrupt(INVALID_IRQ, opCode));
                        _Kernel.completeProc();
                        this.init();
                        Control.cpuDisplay();
                        break;
                }
            }
        }
        //load accu with constant
        public loadAccConst() {
            this.Acc = parseInt(this.retrieve(this.PC + 1), 16);
            this.PC = this.PC + 2;
        }
        //load accu form memory
        public loadAccMem() {
            var memAddress;
            var index;
            memAddress = this.retrieve(this.PC + 2) + this.retrieve(this.PC + 1);
            index = parseInt(memAddress, 16);  
            this.Acc = parseInt(this.retrieve(index), 16);;
            this.PC = this.PC + 3;

        }
        //store accu in memory
        public storeAccMem() {
            var memAddress;
            memAddress = this.retrieve(this.PC + 2) + this.retrieve(this.PC + 1);                        
            _MemoryManager.updateMem(memAddress, this.Acc);
            this.PC = this.PC + 3;

        }
        //add with carry
        public addWithCarry() {
            var memAddress;
            var index;
            memAddress = this.retrieve(this.PC + 2) + this.retrieve(this.PC + 1);                    
            index = parseInt(memAddress, 16); 
            this.Acc = parseInt(this.retrieve(index), 16) + this.Acc;
            this.PC = this.PC + 3;

        }
        //load x with constant
        public loadXregWithConst() {
            this.Xreg = parseInt(this.retrieve(this.PC + 1), 16);;
            this.PC = this.PC + 2;

        }
        //load x from memory
        public loadXregFromMem() {
            var memAddress;
            var index;
            memAddress = this.retrieve(this.PC + 2) + this.retrieve(this.PC + 1);                
            index = parseInt(memAddress, 16);  
            this.Xreg = parseInt(this.retrieve(index), 16);
            this.PC = this.PC + 3;

        }
        //load y with constant
        public loadYregWithConst() {
            this.Yreg = parseInt(this.retrieve(this.PC + 1), 16);
            this.PC = this.PC + 2;

        }
        //load y from memory
        public loadYregFromMem() {
            var memAddress;
            var index;
            memAddress = this.retrieve(this.PC + 2) + this.retrieve(this.PC + 1);                    
            index = parseInt(memAddress, 16);  
            this.Yreg = parseInt(this.retrieve(index), 16);
            this.PC = this.PC + 3;

        }
        //no operation
        public noOp() {
            this.PC++;

        }
        //break
        public break() {
            _Kernel.completeProc();
            this.init();
            Control.cpuDisplay();

        }
        //compare memory to X
        public compareMemToXreg() {
            var memAddress;
            var index;
            memAddress = this.retrieve(this.PC + 2) + this.retrieve(this.PC + 1);                    
            index = parseInt(memAddress, 16);  
            if (parseInt(this.retrieve(index), 16) == this.Xreg){
                this.Zflag = 1;
            } else{
                this.Zflag = 0;
            }
            this.PC = this.PC + 3;

        }
        //branch n bytes
        public branchNBytes() {
            if(this.Zflag == 0){
                var br = parseInt(this.retrieve(this.PC + 1),16) + this.PC;
                if (br < 256){
                    this.PC = br + 2;
                } else {
                    br = br % 256;
                    this.PC = br + 2;
                }
            } else {
                this.PC = this.PC + 2;  
            }   

        }
        //increment byte
        public increByte() {
            var memAddress;
            var index;
            var d;
            memAddress = this.retrieve(this.PC + 2) + this.retrieve(this.PC + 1);                    
            index = parseInt(memAddress, 16);  
            d = parseInt(this.retrieve(index), 16);
            d++;
            _MemoryManager.updateMem(memAddress, d);
            this.PC = this.PC + 3;

        }
        //system call
        public systemCall() {
            var memAddress;
            var index;
            var str: any = "";
            if (this.Xreg == 1){
                str = this.Yreg.toString();
            } else if (this.Xreg == 2){
                memAddress = this.Yreg.toString(16);
                index = parseInt(memAddress, 16);                   
                while (parseInt(this.retrieve(index), 16) != 0){
                    str = str + String.fromCharCode(parseInt(this.retrieve(index), 16));
                    index++;                                   
                }  
            }
            //output
            _KernelInterruptQueue.enqueue(new Interrupt(OUTPUT_IRQ, str));                        
            this.PC++;
        }
    }
}
   