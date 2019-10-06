/* ------------
    memory.ts

     ------------ */
var TSOS;
(function (TSOS) {
    class Memory {
        constructor() {
            //memory array
            this.memorArr = [];
            //partition is free
            this.partition0 = false;
        }
        init() {
            for (var i = 0; i < 256; i++) {
                this.memorArr[i] = "00";
            }
            //display the memory
            this.memDisplay();
        }
        //create a table for memory
        memDisplay() {
            var memStorage = document.getElementById("memStorage");
            var memBody = document.createElement("tbody");
            var memTb = document.createElement("table");
            memTb.className = "memTb";
            memTb.id = "memTb";
            //container for user program inputs
            for (var i = 0; i < 80; i++) {
                var tableCell = document.createElement("td");
                var tableRow = document.createElement("tr");
                var container = 8 * i;
                tableRow.id = "row " + container;
                //memory table output in uppercase
                var location = "000";
                var hexDigit = location + container.toString(16).toUpperCase();
                var output = document.createTextNode(hexDigit.slice(-4));
                //append the output to tablecell and tablecell to tablerow
                tableCell.id = "data" + hexDigit.slice(-4);
                tableCell.appendChild(output);
                tableRow.appendChild(tableCell);
                for (var c = 0; c < 8; c++) {
                    tableCell = document.createElement("td");
                    var data = c + container;
                    var val = location + data.toString(16).toUpperCase();
                    var memoryValue = this.memorArr[data];
                    output = document.createTextNode(memoryValue);
                    tableCell.id = val.slice(-4);
                    tableCell.appendChild(output);
                    tableRow.appendChild(tableCell);
                }
                memBody.appendChild(tableRow);
            }
            memTb.appendChild(memBody);
            memStorage.appendChild(memTb);
        }
        //memory table will show the newly loaded process
        updateMemDisplay(display) {
            var memTb = document.getElementById("memTb");
            var tableRow;
            var data;
            var tableCell;
            var max = display + 256;
            for (var i = display; i < max / 8; i++) {
                var container = 8 * i;
                tableRow = "row " + container;
                for (var c = 0; c < 8; c++) {
                    var location = "000";
                    data = c + container;
                    var val = location + data.toString(16).toUpperCase();
                    tableCell = val.slice(-4);
                    memTb.rows.namedItem(tableRow).cells.namedItem(tableCell).innerHTML = this.memorArr[data];
                }
            }
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map