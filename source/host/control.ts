/* ------------
     Control.ts

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            //creating memory
            _Memory = new Memory();
            _Memory.init();
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.
           
            function dateTime() { 
                //displays date and time when the start button is clicked
                var dateTime = new Date().toLocaleString();
                document.getElementById("datetime").innerText = dateTime; 
            }
            setInterval(dateTime, 1000); //update the date and time every second
           
        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }

        //table to display pcb
        public static makePcbTable(pcb): void {
            var pcbTable = <HTMLTableSectionElement> document.getElementById("pcbTable");         
            var pcbRow = <HTMLTableRowElement> document.createElement("tr");
            var pcbCell = <HTMLTableCellElement> document.createElement("td");
            pcbRow.id = pcb.pid;
            //base and limit
            var base;
            var limit;
            //if partition 0 is taken then base is 0 and limit is FF
            if (_MemoryManager.memory == 0) {
                base = 0;
                limit = "FF";
            //if partition 1 is taken then base is 100 and limit is 1FF
            } else if(_MemoryManager.memory == 256) {
                base = 100;
                limit = "1FF";
            //if partition 2 is taken then base is 200 and limit is 2FF
            } else if(_MemoryManager.memory == 512) {
                base = 200;
                limit = "2FF";
            //if memory is fulled then base is HDD and limit is 100
            } else if (_MemoryManager.memory == 769) {
                base = "HDD";
                limit = 100;
            }
            //displaying pid
            pcbCell.appendChild(document.createTextNode(pcb.pid));
            pcbRow.appendChild(pcbCell);
            //displaying priority
            pcbCell = document.createElement("td");    
            pcbCell.appendChild(document.createTextNode(pcb.priority));
            pcbRow.appendChild(pcbCell);
            //displaying state
            pcbCell = document.createElement("td");    
            pcbCell.appendChild(document.createTextNode(pcb.state));
            pcbRow.appendChild(pcbCell);
            //displaying pc
            pcbCell = document.createElement("td"); 
            pcbCell.appendChild(document.createTextNode(pcb.pc)); 
            pcbRow.appendChild(pcbCell);
            //displayin ir
            pcbCell = document.createElement("td"); 
            pcbCell.appendChild(document.createTextNode("0")); 
            pcbRow.appendChild(pcbCell);
            //displaying acc
            pcbCell = document.createElement("td");     
            pcbCell.appendChild(document.createTextNode(pcb.acc)); 
            pcbRow.appendChild(pcbCell);
            //displaying xreg
            pcbCell = document.createElement("td");            
            pcbCell.appendChild(document.createTextNode(pcb.x)); 
            pcbRow.appendChild(pcbCell);
            //displaying yreg
            pcbCell = document.createElement("td");            
            pcbCell.appendChild(document.createTextNode(pcb.y)); 
            pcbRow.appendChild(pcbCell);
            //displaying zflag
            pcbCell = document.createElement("td");    
            pcbCell.appendChild(document.createTextNode(pcb.z));
            pcbRow.appendChild(pcbCell);
            //displaying lcoation
            pcbCell = document.createElement("td");                
            pcbCell.appendChild(document.createTextNode(pcb.location)); 
            pcbRow.appendChild(pcbCell);
            //displaying base
            pcbCell = document.createElement("td");
            pcbCell.appendChild(document.createTextNode(base));
            pcbRow.appendChild(pcbCell);
            //displaying limit
            pcbCell = document.createElement("td");
            pcbCell.appendChild(document.createTextNode(limit));
            pcbRow.appendChild(pcbCell);
            pcbTable.appendChild(pcbRow);
        } 
        //updates the pcb table
        public static updatePcbTable(pid, state, location): void {
            var pCounter = _CPU.PC.toString(16).toLocaleUpperCase();              
            var pcbRow = <HTMLTableRowElement> document.getElementById(pid);
            if (pCounter.length == 1) {
                pCounter = "0" + pCounter;
            }
            //update state
            pcbRow.cells.item(2).innerHTML = state;
            //update pc
            pcbRow.cells.item(3).innerHTML = pCounter;
            //update ir
            pcbRow.cells.item(4).innerHTML = _CPU.IR;
            //update acc
            pcbRow.cells.item(5).innerHTML = _CPU.Acc.toString(16);
            //update xreg
            pcbRow.cells.item(6).innerHTML = _CPU.Xreg.toString(16);
            //update yreg
            pcbRow.cells.item(7).innerHTML = _CPU.Yreg.toString(16).toUpperCase();
            //update zflag
            pcbRow.cells.item(8).innerHTML = _CPU.Zflag.toString(16);
            //update location
            pcbRow.cells.item(9).innerHTML = location;
        }
        //remove the pid that finish running
        public static clearPcbTable(pid): void {
            var pcbTable = <HTMLTableSectionElement> document.getElementById("pcbTable");
            //clear the entire table if pid is less than 0 (called from killall and clearmem)
            if (pid < 0) {
                //clear everything form the pcb table
                while (pcbTable.hasChildNodes()) {
                    pcbTable.removeChild(pcbTable.firstChild);
                    }
                } else {
                    var pcbRow = <HTMLTableSectionElement> document.getElementById(pid);
                    //remove the pid row
                    pcbRow.parentNode.removeChild(pcbRow);
                }
        }
         //create a table for memory
         public static memDisplay(): void {
            var memStorage = <HTMLDivElement> document.getElementById("memStorage");
            var memBody = <HTMLTableSectionElement> document.createElement("tbody");
            var memTb = <HTMLTableElement> document.createElement("table");
            memTb.className = "memTb";
            memTb.id = "memTb";
                
            //display container for user program inputs in memory display
            for (var i = 0; i < 96; i++) {
                var tableCell = <HTMLTableCellElement> document.createElement("td");
                var tableRow = <HTMLTableRowElement> document.createElement("tr");
                var container = 8 * i;
                tableRow.id = "row " + container;
                //memory table output in uppercase
                var location = "x0"
                var hexDigit = location + container.toString(16).toUpperCase();
                //append the output to tablecell and tablecell to tablerow
                tableCell.id = "data" + hexDigit.slice(-4);
                tableCell.appendChild(document.createTextNode(hexDigit.slice(-4)));
                tableRow.appendChild(tableCell);        
    
                for (var c = 0; c < 8; c++) {
                    tableCell = document.createElement("td");
                    var data = c + container;
                    var val = location + data.toString(16).toUpperCase();
                    tableCell.id = val.slice(-4);

                    tableCell.appendChild(document.createTextNode(_Memory.memorArr[data]));
                    tableRow.appendChild(tableCell);
                }
                memBody.appendChild(tableRow);
            }
                
            memTb.appendChild(memBody);
            memStorage.appendChild(memTb);
        }
        //memory table will show the newly loaded process
        public static updateMemDisplay(display): void {
            var memTb = <HTMLTableElement> document.getElementById("memTb");
            var tableRow;
            var data;                    
            var tableCell;

            for (var i = 0; i < 32 ; i++) {
                var container = ((8 * i) + display);
                tableRow = "row " + container;
    
                for (var c = 0; c < 8; c ++) {
                    var location = "x0"
                    data = c + container;
                    var val = location + data.toString(16).toUpperCase();                            
                    tableCell = val.slice(-4);                            
                    memTb.rows.namedItem(tableRow).cells.namedItem(tableCell).innerHTML = _Memory.memorArr[data];
                }
            }
        }
        //display for CPU
        public static cpuDisplay(): void {
            var pCounter = _CPU.PC.toString(16).toLocaleUpperCase();	
            var cpuDisplay = <HTMLTableElement> document.getElementById("cpu");	
            if (pCounter.length == 1) {
                pCounter = "0" + pCounter;
            }
            //updating pc
            cpuDisplay.rows[1].cells.namedItem("pc").innerHTML = pCounter;	
            //update ir
            cpuDisplay.rows[1].cells.namedItem("ir").innerHTML = _CPU.IR;    
            //update acc        	
            cpuDisplay.rows[1].cells.namedItem("acc").innerHTML = _CPU.Acc.toString(16); 
            //update xreg           	
            cpuDisplay.rows[1].cells.namedItem("x").innerHTML = _CPU.Xreg.toString(16);   
            //update yreg        	
            cpuDisplay.rows[1].cells.namedItem("y").innerHTML = _CPU.Yreg.toString(16).toUpperCase(); 
            //update zflag           	
            cpuDisplay.rows[1].cells.namedItem("z").innerHTML = _CPU.Zflag.toString(16);                        	
        }
        //display the disk
        public static hardDiskDisplay(): void {
            var container = <HTMLDivElement> document.getElementById("disk");
            var tbBody = <HTMLTableSectionElement> document.createElement("tbody");
            var tb = <HTMLTableElement> document.createElement("table");
            tb.className = "disktable";
            tb.id = "disktable";
            //making cells
            for (var i = 0; i < sessionStorage.length; i++) {
                //display rows
                var tableRow = <HTMLTableRowElement> document.createElement("tr");
                var tableCell = <HTMLTableCellElement> document.createElement("td");
                var dataBlock = this.block(sessionStorage.key(i).toString());
                tableRow.id = sessionStorage.key(i).toString();
                //tsb 
                var cellText = document.createTextNode(sessionStorage.key(i).toString().charAt(0) + ":" + sessionStorage.key(i).toString().charAt(1) + ":" + sessionStorage.key(i).toString().charAt(2));
                tableCell.appendChild(cellText);
                tableRow.appendChild(tableCell);        
                //byte
                tableCell = document.createElement("td");
                cellText = document.createTextNode(dataBlock.pop());
                tableCell.appendChild(cellText);
                tableRow.appendChild(tableCell);  
                //data pointer
                tableCell = document.createElement("td");
                cellText = document.createTextNode(dataBlock.pop());
                tableCell.appendChild(cellText);
                tableRow.appendChild(tableCell); 
                //remaining bytes
                tableCell = document.createElement("td");
                cellText = document.createTextNode(dataBlock.pop());
                tableCell.appendChild(cellText);
                tableRow.appendChild(tableCell);            
                tbBody.appendChild(tableRow);
            }
            tb.appendChild(tbBody);
            container.appendChild(tb);
        }
        //update the disk table
        public static updateDiskDisplay(tsb): void {
            var tb = <HTMLTableElement> document.getElementById("disktable");
            var index = this.block(tsb);       
            tb.rows.namedItem(tsb).cells[1].innerHTML = index.pop();             
            //data pointer
            tb.rows.namedItem(tsb).cells[2].innerHTML = index.pop(); 
            //remaining bytes
            tb.rows.namedItem(tsb).cells[3].innerHTML = index.pop();
        }
        //data block
        public static block(tsb): string[] {
            var index = new Array<string>();
            //data bytes
            index.push(JSON.parse(sessionStorage.getItem(tsb)).splice(4,60).toString().replace(/,/g,""));
            //data pointer
            index.push(JSON.parse(sessionStorage.getItem(tsb)).splice(1,3).toString().replace(/,/g,""));
            //first byte
            index.push(JSON.parse(sessionStorage.getItem(tsb)).splice(0,1).toString());
            return index;       
        }
    }
}
