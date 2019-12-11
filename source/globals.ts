/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in our text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
const APP_NAME: string    = "MatrixOS";   // 'cause Bob and I were at a loss for a better name.
const APP_VERSION: string = "0.1";   // What did you expect?

const CPU_CLOCK_INTERVAL: number = 100;   // This is in ms (milliseconds) so 1000 = 1 second.

const TIMER_IRQ: number = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                              // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const KEYBOARD_IRQ: number = 1;
var INVALID_IRQ = 2; //program error
var OUTPUT_IRQ = 3; //program result
const CS_IRQ = 4; //context switch
const Bounds_IRQ = 5; //out of bounds error
const KILL_IRQ = 6; //kill a program



//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var commands = ["help", "ver", "shutdown", "cls", "man", "trace", "rot13", "prompt", "date", "whereami", "theme", "stoptheme", "status", "bsod", "load"]; //all shell commands 

var theme = new Audio('https://ia600901.us.archive.org/27/items/tvtunes_7626/The%20Matrix.mp3'); //link to the Matrix theme mp3 website

var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _PCB: TSOS.Pcb;
var _MemoryManager: TSOS.MemoryManager;
var _Memory: TSOS.Memory;
var _MemoryAccessor: TSOS.MemoryAccessor;
var _CpuScheduler: TSOS.CpuScheduler; 
var _Swapper: TSOS.Swapper; 

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas: HTMLCanvasElement;          // Initialized in Control.hostInit().
var _DrawingContext: any;                // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily: string = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize: number = 13;
var _FontHeightMargin: number = 4;       // Additional space added to font size when advancing a line.

var _Trace: boolean = true;              // Default the OS trace to be on.

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue: TSOS.Queue = null;
var _KernelInputQueue: TSOS.Queue = null; 
var _KernelBuffers = null; 
var _PID = -1; //pid will start at 0 
var _NewProcess; //resident list
var _RunningProcess; //running list
var _Quantum = 6; //default quantum is 6
var _PIDWaiting = []; //contains pids of ready programs
var _PIDRunning = []; //contains pids of running programs
var _PIDAll = []; //contains all pids

// Standard input and output
var _StdIn:  TSOS.Console = null; 
var _StdOut: TSOS.Console = null;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver: TSOS.DeviceDriverKeyboard  = null;
var _FileSystemDeviceDriver;

var _hardwareClockID: number = null;

// For testing (and enrichment)...
var Glados: any = null;  // This is the function Glados() in glados-ip*.js http://alanclasses.github.io/TSOS/test/ .
var _GLaDOS: any = null; // If the above is linked in, this is the instantiated instance of Glados.

var onDocumentLoad = function() {
    TSOS.Control.hostInit();
    //New fsDD when a new window is open
    if(sessionStorage){
        if(sessionStorage.length != 0) { 
            //display the disk
            TSOS.Control.hardDiskDisplay();
        }
    } 
};
