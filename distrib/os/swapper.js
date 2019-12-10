/* ------------
     Swapper.ts
     ------------ */
var TSOS;
(function (TSOS) {
    class Swapper {
        swapper(data, memAdd, max) {
            var prog = new Array();
            //call the fsDD to save program
            var newData = _FileSystemDeviceDriver.saveProgram();
            //if program is saved into disk
            if (newData) {
                //call memory manager to free up memory
                _MemoryManager.freeMem(memAdd);
                //program move from disk to memory
                prog = _FileSystemDeviceDriver.getProgram(data);
                for (var i = 0; i < prog.length; i++) {
                    //call memory manager to write memory
                    _MemoryManager.writeMem(memAdd, memAdd + i, prog[i]);
                }
                return newData;
            }
            else {
                return null;
            }
        }
    }
    TSOS.Swapper = Swapper;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=swapper.js.map