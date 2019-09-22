/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    class Console {
        constructor(currentFont = _DefaultFontFamily, currentFontSize = _DefaultFontSize, currentXPosition = 0, currentYPosition = _DefaultFontSize, buffer = "", previousBuffer = [], previousIndex = 0) {
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.previousBuffer = previousBuffer;
            this.previousIndex = previousIndex;
        }
        init() {
            this.clearScreen();
            this.resetXY();
        }
        clearScreen() {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }
        resetXY() {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }
        handleInput() {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    //storing inputs into the array
                    this.previousBuffer.push(this.buffer);
                    this.previousIndex = this.previousBuffer.length;
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        }
        putText(text) {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                //if the current position surpasses the canvas, advanceLine() is called
                if (this.currentXPosition > _Canvas.width) {
                    this.advanceLine();
                }
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        }
        advanceLine() {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            // TODO: Handle scrolling. (iProject 1)
            if (this.currentYPosition > _Canvas.height) {
                //x coordinate of extraction
                var sX = 0;
                //y coordinate of extraction. + 7 seems to be the right amount of spacing between lines
                var sY = this.currentFontSize + 7;
                //x coordinate of placement
                var dX = 0;
                //y coordinate of placement
                var dY = 0;
                var yPosition = _Canvas.height - _DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                    _FontHeightMargin;
                //getImageData() save the current canvas
                var canvasImg = _DrawingContext.getImageData(sX, sY, _Canvas.width, _Canvas.height);
                //putImageData() place the saved canvas 
                _DrawingContext.putImageData(canvasImg, dX, dY);
                this.currentYPosition = yPosition;
            }
        }
        delete(text) {
            var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
            var y = this.currentYPosition - this.currentFontSize;
            //+5 fixes the issue where some of the pixels remained after being cleared
            var height = this.currentFontSize + 5;
            //shifting the current x position back 
            this.currentXPosition = this.currentXPosition - offset;
            //clear the deleted user input 
            _DrawingContext.clearRect(this.currentXPosition, y, offset, height);
        }
        tab(text) {
            //Create an empty array to put code-complete options into.
            var completeCommand = [];
            //go through all the commands array to find match
            for (var i = 0; i < commands.length; i++) {
                if (commands[i].match(text)) {
                    completeCommand.push(commands[i]);
                }
            }
            if (completeCommand.length > 0) {
                var index = 0;
                var result = completeCommand[index];
                index++;
                if (index > completeCommand.length - 1) {
                    index = 0;
                }
            }
            //returning the completed command
            return result;
        }
        //called when the up arrow is pressed
        upArrow() {
            //going back along the previous index
            this.previousIndex = this.previousIndex - 1;
            //delete user input
            this.delete(this.buffer);
            this.buffer = "";
            if (this.previousBuffer[this.previousIndex]) {
                this.evoke(this.previousBuffer[this.previousIndex]);
            }
        }
        //called when the down arrow is pressed.
        downArrow() {
            //going forward along the previous index
            this.previousIndex = this.previousIndex + 1;
            //delete user input
            this.delete(this.buffer);
            this.buffer = "";
            if (this.previousBuffer[this.previousIndex]) {
                this.evoke(this.previousBuffer[this.previousIndex]);
            }
        }
        //a helper function for up and down arrow
        evoke(text) {
            for (var i = 0; i < text.length; i++) {
                _KernelInputQueue.enqueue(text.charAt(i));
            }
        }
    }
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=console.js.map