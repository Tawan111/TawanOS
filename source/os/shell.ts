/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
            var sc: ShellCommand;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // date
            sc = new ShellCommand(this.shellDate,
                                  "date",
                                  "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new ShellCommand(this.shellWhereami,
                                 "whereami",
                                 "- Displays location.");
            this.commandList[this.commandList.length] = sc;

            // theme
            sc = new ShellCommand(this.shellTheme,
                                "theme",
                                "- Plays the Matrix theme song.");
            this.commandList[this.commandList.length] = sc;

            // stoptheme
            sc = new ShellCommand(this.shellStoptheme,
                                "stoptheme",
                                "- Stop the Matrix theme song.");
            this.commandList[this.commandList.length] = sc;

            // status
            sc = new ShellCommand(this.shellStatus,
                                "status",
                                "<string> - Sets a status message.");
            this.commandList[this.commandList.length] = sc;

             // bsod
             sc = new ShellCommand(this.shellBsod,
                                "bsod",
                                "- Will crash the OS.");
            this.commandList[this.commandList.length] = sc;

             // load
             sc = new ShellCommand(this.shellLoad,
                                "load",
                                "- Validate the user code.");
            this.commandList[this.commandList.length] = sc;

             // run
             sc = new ShellCommand(this.shellRun,
                                "run",
                                "<pid - Runs the process according to the id.");
            this.commandList[this.commandList.length] = sc;

             // clearmem
             sc = new ShellCommand(this.shellClearmem,
                                "clearmem",
                                "- Will clear all memory");
            this.commandList[this.commandList.length] = sc;

             // runall
             sc = new ShellCommand(this.shellRunall,
                                "runall",
                                "- Will run all programs");
            this.commandList[this.commandList.length] = sc;

             // ps
             sc = new ShellCommand(this.shellPs,
                                "ps",
                                "- display the PID and state of all processes");
            this.commandList[this.commandList.length] = sc;

             // kill
             sc = new ShellCommand(this.shellKill,
                                "kill",
                                "- kill one process");
            this.commandList[this.commandList.length] = sc;

            // killall
            sc = new ShellCommand(this.shellKillall,
                                "killall",
                                "- kill all processes");
            this.commandList[this.commandList.length] = sc;

            // quantum
            sc = new ShellCommand(this.shellQuantum,
                                "quantum",
                                "- let the user set the Round Robin quantum (measured in cpu cycles)");
            this.commandList[this.commandList.length] = sc;

            // format
            sc = new ShellCommand(this.shellFormat,
                                "format",
                                "- Initialize all blocks in all sectors in all tracks");
            this.commandList[this.commandList.length] = sc;

            // ls
            sc = new ShellCommand(this.shellLs,
                                "ls",
                                "- List the Giles currently stored on the disk");
            this.commandList[this.commandList.length] = sc;

            // create
            sc = new ShellCommand(this.shellCreate,
                                "create",
                                "<filename> - Create the Gile");
            this.commandList[this.commandList.length] = sc;

            // read
            sc = new ShellCommand(this.shellRead,
                                "read",
                                "<filename> - Read and display the contents of filename");
            this.commandList[this.commandList.length] = sc;

            // write
            sc = new ShellCommand(this.shellWrite,
                                "write",
                                "<filename> - Write the data inside the quotes to filename");
            this.commandList[this.commandList.length] = sc;

            // delete
            sc = new ShellCommand(this.shellDelete,
                                "delete",
                                "<filename> - Remove filename from storage");
            this.commandList[this.commandList.length] = sc;

            // getschedule
            sc = new ShellCommand(this.shellGetschedule,
                                "getschedule",
                                "- Currently selected CPU scheduling algorithm");
            this.commandList[this.commandList.length] = sc;

            // setschedule
            sc = new ShellCommand(this.shellSetschedule,
                                "setschedule",
                                "<schedule> - Select a CPU scheduling algorithm");
            this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);  // Note that args is always supplied, though it might be empty.
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer: string): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.

        public shellVer(args: string[]) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args: string[]) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args: string[]) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }

        public shellCls(args: string[]) {         
            _StdOut.clearScreen();     
            _StdOut.resetXY();
        }

        public shellDate(args: string[]) {
            var date = new Date().toLocaleString(); // current date/time
            _StdOut.putText(date); // displays the date/time 
        }

        public shellWhereami(args: string[]) {
            var pillsArray = ['Red pill. You are now experiencing the brutal truth of reality', 'Blue pill. Enjoy the simple life of blissful ignorance'];
            var random = pillsArray[Math.floor(Math.random() * pillsArray.length)];  //randomly select from pillsArray
            _StdOut.putText("You took the " + random);
        }

        public shellTheme(args: string[]) {
            theme.play(); //plays The Matrix theme song
        }

        public shellStoptheme(args: string[]) {
            theme.pause(); //stop the song
            theme.currentTime = 0; //reset the song to the beginning
        }

        public shellStatus(args: string[]) {
            if (args.length > 0) {
                var status = args.toLocaleString().split(',').join(' '); //split() and join() fixes the issue where a space is replaced by a comma
                document.getElementById("status").innerText = "Status: " + status;
            } else {
                _StdOut.putText("Usage: status <string> Please supply a string.");
            }
        }

        public shellBsod(args: string[]) {
            _Kernel.krnTrapError('OS crashed');
        }
        //load program
        public shellLoad(args: string[]) {
            var prog = <HTMLInputElement>document.getElementById('taProgramInput');
            //has to be value
            var userInput = prog.value
            //RegExp for matching hex digits
            var regExpTest: RegExp = /[a-fA-F0-9]{2}/;
            var validator = false;
            //test to see if the user input match RegExp 
            //also check if the input field is empty
            if (userInput == "") {
                _StdOut.putText("User Program Input field is empty.")
            } else if (userInput.match(regExpTest)){
                //validator is true when valid hex digits are detected
                validator = true;
            } else {
                //if the user input field contain non-hex digits
                _StdOut.putText("Invalid! non-hex digits detected.");
            }
            //if hex digits are detected
            if (validator == true) {
                var OpCodes = userInput.split(" ");
                //if memory is above limit
                if (OpCodes.length == 769){
                    _StdOut.putText("Memory is not big enough.");
                } else {
                    //val from memory
                    var memory = _MemoryManager.checkPartition(OpCodes);
                    //if memory have not reach its limit
                    if (memory < 768){
                        //call kernel to create new program
                        var pid = _Kernel.newProg(memory);
                        _StdOut.putText("Successfully Loaded Process id: " + pid); 
                    }   
                }   
            }   
        }
        //run selected program
        public shellRun(pid) {
            //check if a pid is entered
            if (pid != "") {
                //check if there's any program loaded
                if (_NewProcess.isEmpty()){
                    _StdOut.putText("No program is loaded.");
                } else {
                    //call kernel to run a program
                    _Kernel.runProg(pid);
                } 
              //if no pid is entered
            } else {
                _StdOut.putText("Must input a PID.");
            }  
        }
        //clear all memory
        public shellClearmem(args: string[]) {
            //Check if cpu is running
            if(_CPU.isExecuting == false) {
                //clear memory
                _MemoryManager.clearMem();
                //clear pcb display
                Control.clearPcbTable(-1);
                //gets rid of loaded programs
                while(!_NewProcess.isEmpty()){
                    _NewProcess.dequeue();
                }
                //empty the pid array for waiting pids
                _PIDWaiting = [];
              //if cpu is currently running
            } else {
                _StdOut.putText("CPU is running, memory cannot be cleared.")
            }
        }
        //run all programs
        public shellRunall(args) {
            //check if there any program loaded
            if (_NewProcess.isEmpty()){
                _StdOut.putText("No program is loaded.");
            } else {
                //call kernel to run all programs
                _Kernel.runAllProg();
            } 
        }
        //display loaded programs in their current state
        public shellPs(args) {
            //check if both waiting and running programs are empty
            if (_PIDWaiting.length == 0 && _PIDRunning.length == 0){
                _StdOut.putText("No program is loaded.");
            } else {
                //print the list of programs that are waiting and running
                _StdOut.putText("Ready: " + _PIDWaiting.toString());
                _StdOut.advanceLine();
                _StdOut.putText("Running: " + _PIDRunning.toString());
            }
        }
        //kill a program
        public shellKill(pid) {
            //check for an input and if the input is a positive integer using regular expresstion to test
            if (pid != "" && /^\d*$/.test(pid)){
                //kernel interrupt for kill
                _KernelInterruptQueue.enqueue(new Interrupt(KILL_IRQ, pid));
            } else {
                _StdOut.putText("Must input a PID.");
            }  
        }
        //kill all programs
        public shellKillall(args) {
            //clear memory
            _MemoryManager.clearMem();
            //clear pcb display
            Control.clearPcbTable(-1);
            //gets rid of loaded programs
            while(!_NewProcess.isEmpty()){
                _NewProcess.dequeue();
            }
            //gets rid of running programs
            while(!_RunningProcess.isEmpty()){
                _RunningProcess.dequeue();
            }
            //stop cpu
            _CPU.isExecuting = false;
            //reset cpu
            _CPU.init();
            //empty the pid array for all pids
            _PIDAll = [];
            //empty the pid array for waiting pids
            _PIDWaiting = [];
            //empty the pid array for running pids
            _PIDRunning = [];
        }
        //set quantum 
        public shellQuantum(args) {
            //check for an input and if the input is a positive integer using regular expression to test
            if (args != "" && /^\d*$/.test(args)){
                //update the quantum to integer that user input
                _Quantum = args;
              //if the user input is not an integer or is empty
            } else {
                _StdOut.putText("Must input a quantum value.");
            }  
        }
        //ls
        public shellLs(args) {
            //call the fsDD
            var names = _FileSystemDeviceDriver.lS();
            for(var name in names) {
                //spacing between file names
                _StdOut.putText(names[name] + " ");
            }
        }
        //create
        public shellCreate(args) {
            var name;
            //test RegExp
            if(/^[a-z]+$/i.test(args)) {
                name = args;
                //call the fsDD
                var output = _FileSystemDeviceDriver.create(name);
                //print
                _StdOut.putText(output);
            } else {
                _StdOut.putText("Must input only numbers and letters");
            }
        }
        //read
        public shellRead(args) {
        }
        //write
        public shellWrite(args) {           
        }
        //delete
        public shellDelete(args) {         
        }
        //format
        public shellFormat(args) {
        }
        //getschedule
        public shellGetschedule(args) {
        }
        //setschedule
        public shellSetschedule(args) {
        }
        public shellMan(args: string[]) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "ver":
                        _StdOut.putText("Displays the current version data.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
                        break;
                    case "cls":
                        _StdOut.putText("Clears the screen and resets the cursor position.");
                        break;
                    case "man":
                        _StdOut.putText("Displays the manual page for <topic>.");
                        break;
                    case "trace":
                        _StdOut.putText("Turns the OS trace on or off.");
                        break;
                    case "rot13":
                        _StdOut.putText("Does rot13 obfuscation on <string>.");
                        break;
                    case "prompt":
                         _StdOut.putText("Sets the prompt.");
                         break;
                    case "date":
                         _StdOut.putText("Displays the current date and time.");
                         break;
                    case "whereami":
                         _StdOut.putText("Displays location.");
                         break;
                     case "theme":
                        _StdOut.putText("Plays The Matrix theme song.");
                        break;
                    case "stoptheme":
                        _StdOut.putText("Stops The Matrix Theme song.");
                        break;
                    case "status":
                        _StdOut.putText("<string> - Sets a status message.");
                        break;
                    case "bsod":
                        _StdOut.putText("Will crash the OS.");
                        break;
                    case "load":
                        _StdOut.putText("Validate the user code.");
                        break;
                    case "run":
                        _StdOut.putText("Runs the process according to the id");
                        break;
                    case "clearmem":
                        _StdOut.putText("Clears all memory");
                        break;
                    case "runall":
                        _StdOut.putText("Run all programs");
                        break;
                    case "ps":
                        _StdOut.putText("Display the PID and state of all processes");
                        break;
                    case "kill":
                        _StdOut.putText("Kill one process");
                        break;
                    case "killall":
                        _StdOut.putText("kill all process");
                        break;
                    case "quantum":
                        _StdOut.putText("Let the user set the Round Robin quantum (measured in cpu cycles)");
                        break;
                    case "format":
                        _StdOut.putText("Initialize all blocks in all sectors in all tracks");
                        break;
                    case "ls":
                        _StdOut.putText("List the Giles currently stored on the disk");
                        break;
                    case "create":
                        _StdOut.putText("Create the GIle filename");
                        break;
                    case "read":
                        _StdOut.putText("Read and display the contents of filename");
                        break;
                    case "write":
                        _StdOut.putText("Write the data inside the quotes to filename");
                        break;
                    case "delete":
                        _StdOut.putText("Remove filename form storage");
                        break;
                    case "getschedule":
                        _StdOut.putText("Currently selected CPU scheduling algorithm");
                        break;
                    case "setschedule":
                        _StdOut.putText("Select a CPU scheduling algorithm");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args: string[]) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args: string[]) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args: string[]) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

    }
}

