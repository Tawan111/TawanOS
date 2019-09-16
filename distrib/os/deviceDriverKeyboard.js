/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverKeyboard extends TSOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }
        krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted === true) {
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                }
                else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                // TODO: Check for caps-lock and handle as shifted if so.
            }
            else if (((keyCode >= 48) && (keyCode <= 57)) || // digits
                (keyCode == 32) || // space
                (keyCode == 13)) { // enter
                chr = String.fromCharCode(keyCode);
                // Punctuations and symbols
                if (isShifted) {
                    switch (keyCode) {
                        case 48:
                            chr = ")";
                            break;
                        case 49:
                            chr = "!";
                            break;
                        case 50:
                            chr = "@";
                            break;
                        case 51:
                            chr = "#";
                            break;
                        case 52:
                            chr = "$";
                            break;
                        case 53:
                            chr = "%";
                            break;
                        case 54:
                            chr = "^";
                            break;
                        case 55:
                            chr = "&";
                            break;
                        case 56:
                            chr = "*";
                            break;
                        case 57:
                            chr = "(";
                            break;
                    }
                }
                // Remaining punctuations and symbols
            }
            else if (((keyCode >= 186) && (keyCode <= 192)) ||
                ((keyCode >= 219) && (keyCode <= 222))) {
                switch (keyCode) {
                    case 186:
                        if (isShifted)
                            chr = ":";
                        else
                            chr = ";";
                        break;
                    case 187:
                        if (isShifted)
                            chr = "+";
                        else
                            chr = "=";
                        break;
                    case 188:
                        if (isShifted)
                            chr = "<";
                        else
                            chr = "-";
                        break;
                    case 189:
                        if (isShifted)
                            chr = "_";
                        else
                            chr = "-";
                        break;
                    case 190:
                        if (isShifted)
                            chr = ">";
                        else
                            chr = ".";
                        break;
                    case 191:
                        if (isShifted)
                            chr = "?";
                        else
                            chr = "/";
                        break;
                    case 192:
                        if (isShifted)
                            chr = "~";
                        else
                            chr = "`";
                        break;
                    case 219:
                        if (isShifted)
                            chr = "{";
                        else
                            chr = "[";
                        break;
                    case 220:
                        if (isShifted)
                            chr = "|";
                        else
                            chr = "\\";
                        break;
                    case 221:
                        if (isShifted)
                            chr = "}";
                        else
                            chr = "]";
                        break;
                    case 222:
                        if (isShifted)
                            chr = "\"";
                        else
                            chr = "'";
                        break;
                }
            }
            else if (keyCode == 8) { //delete 
                var deletedChr = -1;
                _Console.delete(_Console.buffer.charAt(_Console.buffer.length - 1));
                //deleting the last input
                _Console.buffer = _Console.buffer.slice(0, deletedChr);
            }
            else if (keyCode == 9) { //tab for code completion. If no user input, tab will complete the help command to print out all of the commands
                var buffer = _Console.tab(_Console.buffer);
                if (buffer.length > 0) {
                    //delete the user input
                    _Console.delete(_Console.buffer);
                    //replacing buffer with completed command
                    _Console.buffer = buffer;
                    _Console.putText(_Console.buffer);
                }
            }
            else if (keyCode == 38) { //up arrow
                _Console.upArrow();
            }
            else if (keyCode == 40) { //down arrow
                _Console.downArrow();
            }
            _KernelInputQueue.enqueue(chr);
        }
    }
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverKeyboard.js.map