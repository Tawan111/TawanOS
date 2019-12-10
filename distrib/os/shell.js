/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    class Shell {
        constructor() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        init() {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellWhereami, "whereami", "- Displays location.");
            this.commandList[this.commandList.length] = sc;
            // theme
            sc = new TSOS.ShellCommand(this.shellTheme, "theme", "- Plays the Matrix theme song.");
            this.commandList[this.commandList.length] = sc;
            // stoptheme
            sc = new TSOS.ShellCommand(this.shellStoptheme, "stoptheme", "- Stop the Matrix theme song.");
            this.commandList[this.commandList.length] = sc;
            // status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Sets a status message.");
            this.commandList[this.commandList.length] = sc;
            // bsod
            sc = new TSOS.ShellCommand(this.shellBsod, "bsod", "- Will crash the OS.");
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Validate the user code.");
            this.commandList[this.commandList.length] = sc;
            // run
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<pid - Runs the process according to the id.");
            this.commandList[this.commandList.length] = sc;
            // clearmem
            sc = new TSOS.ShellCommand(this.shellClearmem, "clearmem", "- Will clear all memory");
            this.commandList[this.commandList.length] = sc;
            // runall
            sc = new TSOS.ShellCommand(this.shellRunall, "runall", "- Will run all programs");
            this.commandList[this.commandList.length] = sc;
            // ps
            sc = new TSOS.ShellCommand(this.shellPs, "ps", "- display the PID and state of all processes");
            this.commandList[this.commandList.length] = sc;
            // kill
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "- kill one process");
            this.commandList[this.commandList.length] = sc;
            // killall
            sc = new TSOS.ShellCommand(this.shellKillall, "killall", "- kill all processes");
            this.commandList[this.commandList.length] = sc;
            // quantum
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "- let the user set the Round Robin quantum (measured in cpu cycles)");
            this.commandList[this.commandList.length] = sc;
            // format
            sc = new TSOS.ShellCommand(this.shellFormat, "format", "- Initialize all blocks in all sectors in all tracks");
            this.commandList[this.commandList.length] = sc;
            // ls
            sc = new TSOS.ShellCommand(this.shellLs, "ls", "- List the Giles currently stored on the disk");
            this.commandList[this.commandList.length] = sc;
            // create
            sc = new TSOS.ShellCommand(this.shellCreate, "create", "<filename> - Create the Gile");
            this.commandList[this.commandList.length] = sc;
            // read
            sc = new TSOS.ShellCommand(this.shellRead, "read", "<filename> - Read and display the contents of filename");
            this.commandList[this.commandList.length] = sc;
            // write
            sc = new TSOS.ShellCommand(this.shellWrite, "write", "<filename> - Write the data inside the quotes to filename");
            this.commandList[this.commandList.length] = sc;
            // delete
            sc = new TSOS.ShellCommand(this.shellDelete, "delete", "<filename> - Remove filename from storage");
            this.commandList[this.commandList.length] = sc;
            // getschedule
            sc = new TSOS.ShellCommand(this.shellGetschedule, "getschedule", "- Currently selected CPU scheduling algorithm");
            this.commandList[this.commandList.length] = sc;
            // setschedule
            sc = new TSOS.ShellCommand(this.shellSetschedule, "setschedule", "<schedule> - Select a CPU scheduling algorithm");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            // Display the initial prompt.
            this.putPrompt();
        }
        putPrompt() {
            _StdOut.putText(this.promptStr);
        }
        handleInput(buffer) {
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
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        execute(fn, args) {
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
        parseInput(buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
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
        shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }
        shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }
        shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        }
        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.
        shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }
        shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }
        shellShutdown(args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }
        shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }
        shellDate(args) {
            var date = new Date().toLocaleString(); // current date/time
            _StdOut.putText(date); // displays the date/time 
        }
        shellWhereami(args) {
            var pillsArray = ['Red pill. You are now experiencing the brutal truth of reality', 'Blue pill. Enjoy the simple life of blissful ignorance'];
            var random = pillsArray[Math.floor(Math.random() * pillsArray.length)]; //randomly select from pillsArray
            _StdOut.putText("You took the " + random);
        }
        shellTheme(args) {
            theme.play(); //plays The Matrix theme song
        }
        shellStoptheme(args) {
            theme.pause(); //stop the song
            theme.currentTime = 0; //reset the song to the beginning
        }
        shellStatus(args) {
            if (args.length > 0) {
                var status = args.toLocaleString().split(',').join(' '); //split() and join() fixes the issue where a space is replaced by a comma
                document.getElementById("status").innerText = "Status: " + status;
            }
            else {
                _StdOut.putText("Usage: status <string> Please supply a string.");
            }
        }
        shellBsod(args) {
            _Kernel.krnTrapError('OS crashed');
        }
        //load program
        shellLoad(args) {
            //max/defualt priority is set to 10
            var p = 10;
            if (/^\d*$/.test(args[0]) || args[0] == null) {
                if (args[0] != null) {
                    p = args[0];
                }
                var prog = document.getElementById('taProgramInput');
                var userInput = prog.value;
                //test to see if user input matach RegExp
                if (/^[a-f\d\s]+$/i.test(userInput)) {
                    var opCodes = userInput.split(" ");
                    //check partition through mem manager
                    var memAdd = _MemoryManager.checkPartition(opCodes);
                    if (memAdd == 769) {
                        //call kernel to load into disk
                        var disk = _Kernel.disk(opCodes);
                        if (disk) {
                            var pid = _Kernel.newProg(memAdd, p, disk);
                        }
                        else {
                            //disk is full
                            _StdOut.putText("No more space on disk");
                        }
                    }
                    else {
                        //call kernel to load new program
                        var pid = _Kernel.newProg(memAdd, p, null);
                    }
                    _StdOut.putText("Successfully Loaded Process id: " + pid);
                    //check if theres field is empty
                }
                else if (userInput == "") {
                    _StdOut.putText("User Program Input field is empty.");
                }
                else {
                    _StdOut.putText("Invalid! non-hex digits detected.");
                }
            }
        }
        //run selected program
        shellRun(pid) {
            //check if a pid is entered
            if (pid != "") {
                //check if there's any program loaded
                if (_NewProcess.isEmpty()) {
                    _StdOut.putText("No program is loaded.");
                }
                else {
                    //call kernel to run a program
                    _Kernel.runProg(pid);
                }
                //if no pid is entered
            }
            else {
                _StdOut.putText("Must input a PID.");
            }
        }
        //clear all memory
        shellClearmem(args) {
            //Check if cpu is running
            if (_CPU.isExecuting == false) {
                //clear memory
                _MemoryManager.clearMem();
                //clear pcb display
                TSOS.Control.clearPcbTable(-1);
                //gets rid of loaded programs
                while (!_NewProcess.isEmpty()) {
                    _NewProcess.dequeue();
                }
                //empty the pid array for waiting pids
                _PIDWaiting = [];
                //if cpu is currently running
            }
            else {
                _StdOut.putText("CPU is running, memory cannot be cleared.");
            }
        }
        //run all programs
        shellRunall(args) {
            //check if there any program loaded
            if (_NewProcess.isEmpty()) {
                _StdOut.putText("No program is loaded.");
            }
            else {
                //call kernel to run all programs
                _Kernel.runAllProg();
            }
        }
        //display loaded programs in their current state
        shellPs(args) {
            //check if both waiting and running programs are empty
            if (_PIDWaiting.length == 0 && _PIDRunning.length == 0) {
                _StdOut.putText("No program is loaded.");
            }
            else {
                //print the list of programs that are waiting and running
                _StdOut.putText("Ready: " + _PIDWaiting.toString());
                _StdOut.advanceLine();
                _StdOut.putText("Running: " + _PIDRunning.toString());
            }
        }
        //kill a program
        shellKill(pid) {
            //check for an input and if the input is a positive integer using regular expresstion to test
            if (pid != "" && /^\d*$/.test(pid)) {
                //kernel interrupt for kill
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(KILL_IRQ, pid));
            }
            else {
                _StdOut.putText("Must input a PID.");
            }
        }
        //kill all programs
        shellKillall(args) {
            //clear memory
            _MemoryManager.clearMem();
            //clear pcb display
            TSOS.Control.clearPcbTable(-1);
            //gets rid of loaded programs
            while (!_NewProcess.isEmpty()) {
                _NewProcess.dequeue();
            }
            //gets rid of running programs
            while (!_RunningProcess.isEmpty()) {
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
        shellQuantum(args) {
            //check for an input and if the input is a positive integer using regular expression to test
            if (args != "" && /^\d*$/.test(args)) {
                //update the quantum to integer that user input
                _Quantum = args;
                //if the user input is not an integer or is empty
            }
            else {
                _StdOut.putText("Must input a quantum value.");
            }
        }
        //ls
        shellLs(args) {
            //call the fsDD
            var names = _FileSystemDeviceDriver.lS();
            for (var name in names) {
                //spacing between file names
                _StdOut.putText(names[name] + " ");
            }
        }
        //create
        shellCreate(args) {
            var name;
            //test RegExp
            if (/^[a-z]+$/i.test(args)) {
                name = args;
                //call the fsDD
                var output = _FileSystemDeviceDriver.create(name);
                //print
                _StdOut.putText(output);
            }
            else {
                _StdOut.putText("Must input only numbers and letters");
            }
        }
        //read
        shellRead(args) {
            var name;
            //test RegExp
            if (/^[a-z]+$/i.test(args)) {
                name = args;
                //call the fsDD
                var output = _FileSystemDeviceDriver.read(name);
                //print
                _StdOut.putText(output);
            }
            else {
                _StdOut.putText("Must input only numbers and letters");
            }
        }
        //write
        shellWrite(args) {
            var name;
            var data;
            //test RegExp
            if (/^[a-z\d]+$/i.test(args[0])) {
                name = args[0];
                //check if file name is input
                if (args.length < 2) {
                    _StdOut.putText("Must enter data to write");
                }
                else {
                    data = args[1];
                    for (var i = 2; i < args.length; i++) {
                        data = data + " " + args[i];
                    }
                    //check if the data is inputed betwen double quote
                    if (data.charAt(0) != '"' || data.charAt(data.length - 1) != '"') {
                        _StdOut.putText("data must be in between double quote");
                    }
                    else {
                        data = data.slice(1, data.length - 1);
                        //call the fsDD
                        var output = _FileSystemDeviceDriver.write(name, data);
                        //print
                        _StdOut.putText(output);
                    }
                }
            }
            else {
                _StdOut.putText("Must input only numbers and letters");
            }
        }
        //delete
        shellDelete(args) {
            var name;
            //test RegExp
            if (/^[a-z]+$/i.test(args)) {
                name = args;
                //call the fsDD
                var output = _FileSystemDeviceDriver.delete(name);
                //print
                _StdOut.putText(output);
            }
            else {
                _StdOut.putText("Must input only numbers and letters");
            }
        }
        //format
        shellFormat(args) {
            //check if CPU is executing
            if (_CPU.isExecuting == false) {
                //call the fsDD
                _FileSystemDeviceDriver.format();
            }
            else {
                _StdOut.putText("Cannot format, CPU is executing");
            }
        }
        //getschedule
        shellGetschedule(args) {
            _StdOut.putText("Scheduling: " + _CpuScheduler.schedule);
        }
        //setschedule
        shellSetschedule(args) {
        }
        shellMan(args) {
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
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }
        shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
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
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }
        shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }
        shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
    }
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shell.js.map