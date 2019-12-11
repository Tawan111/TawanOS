/* ------------
     Swapper.ts
     ------------ */
var TSOS;
(function (TSOS) {
    class Swapper {
        swapper(data, memAdd, max) {
            var prog = new Array();
            var saveProg = this.removeExcess(_MemoryManager.findMem(memAdd, max));
            //call the fsDD to save program
            var newData = _FileSystemDeviceDriver.saveProgram(saveProg);
            //if program is saved into disk
            if (newData) {
                //call memory manager to free up memory
                _MemoryManager.freeMem(memAdd);
                //program move from disk to memory
                prog = _FileSystemDeviceDriver.getProgram(data);
                prog = this.removeExcess(prog);
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
        //delete the extra 00
        removeExcess(program) {
            var deletion = program.pop();
            while (deletion == "00") {
                deletion = program.pop();
            }
            //return last
            program.push(deletion);
            return program;
        }
    }
    TSOS.Swapper = Swapper;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=swapper.js.map