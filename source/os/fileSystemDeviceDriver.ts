/* ------------
    fileSystemDeviceDriver.ts

     ------------ */

module TSOS {

    export class FileSystemDeviceDriver extends DeviceDriver {

        //track
        public t;
        //sector
        public s;
        //block
        public b;
        //block size
        public bSize;
        public directory;
        public data;

        constructor() {
            //access the parent and overwrite
            super();
            this.t = 4;
            this.s = 8;
            this.b = 8;
            this.bSize = 64;
            this.directory =  this.s * this.b;
            this.data = (this.t-1) * this.s * this.b;
            this.driverEntry = this.fsDDEntry;
        }
        public fsDDEntry() {
            //New fsDD when a new window is open
            if(sessionStorage){
                if(sessionStorage.length == 0) { 
                    var index = new Array<string>();
                    for (var i=0; i < 4; i++) {
                        //byte/pointer
                        index.push("0");
                    }
                    //while the value is less than block size
                    while (index.length < this.bSize){
                        index.push("00");
                    }
                    for (var i=0; i < this.t; i++) {
                        for (var a=0; a < this.s; a++) {
                            for (var b=0; b < this.b; b++) {
                                //tsb
                                sessionStorage.setItem(i.toString() + a.toString() + b.toString(), JSON.stringify(index));
                            }
                        }
                    }
                    //display the disk
                    Control.hardDiskDisplay();
                }
            } 
        }
        //file list
        public lS(): string[] {
            var data = new Array<string>();
            var names = new Array<string>();
            var directory;
            //look for file names
            for (var i=1; i < this.directory; i++) {
                data = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));
                if(data[0] == "1"){
                    directory = this.retrieveName(data);
                    names.push(directory);
                    directory = "";
                }
            }
            return(names);
        }
        //look for existing file names
        public retrieveName(data): string {
            var value = 4;
            var name = "";
            //while file exists
            while(data[value] != "00" && value < this.bSize) {
                //file name
                name = name + String.fromCharCode(parseInt(data[value],16));
                value++;
            }
            //return the file name
            return name;
        }
        //create file
        public create(name): string {
            var data = new Array<string>();
            //look for dup file names
            if (this.searchTSBData(name) != null) {
                return "File name already exist";
            } else {
                //MBR is 000
                for (var i=1; i < this.directory; i++) {
                    data = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));
                    if(data[0]=="0"){
                        //clear block with zeros
                        this.clearBlock(sessionStorage.key(i));
                        data = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));
                        if(this.retrieveTSBValue() != null) {
                            data[0] = "1";
                            for (var a=1; a < 4; a++){
                                //directory pointer
                                data[a] = this.retrieveTSBValue().charAt(a-1);
                            }
                            for (var b=0; b < name.toString().length; b++) {
                                data[b+4] = name.toString().charCodeAt(b).toString(16).toUpperCase();
                            }
                            //update the disk
                            this.diskTSB(sessionStorage.key(i),data);
                            return name + " successfully created";
                        } else {
                            return "Disk is full";
                        }
                    }
                }
                return "Directory is full";
            }   
        }
        //search for data
        public searchTSBData(name): string {
            var data;
            var dataarr = new Array<string>();
            var fileName;
            //searcj directory
            for (var i=1; i < this.directory; i++) {
                dataarr = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));
                //if in used
                if(dataarr[0] == "1") {
                    fileName = this.retrieveName(dataarr);
                    if (this.retrieveName(dataarr) == name){
                        data = dataarr.splice(1,3).toString().replace(/,/g,"");
                        dataarr = JSON.parse(sessionStorage.getItem(data));
                        return data;
                    }
                    fileName = "";
                }
            }
            return null;
        }
        //clear disk block
        public clearBlock(tsb){
            var data = JSON.parse(sessionStorage.getItem(tsb));
            //fill block with zero
            for (var i=0; i < 4; i++){
                data[i] = "0";
            }
            for (var a=4; a < data.length; a++) {
                data[a] = "00";
            }
            //update disk
            this.diskTSB(tsb, data);
        }
        //look for TSB data
        public retrieveTSBValue():string {
            var data = new Array<string>();
            for (var i=this.directory; i < sessionStorage.length; i++) {
                data = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));
                //if array is empty
                if(data[0] == "0") {
                    //clear block
                    this.clearBlock(sessionStorage.key(i));
                    data = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));
                    data[0]="1";
                    //update disk
                    this.diskTSB(sessionStorage.key(i), data);
                    return sessionStorage.key(i); 
                }
            }
            return null;
        }
        //update disk block
        public diskTSB(tsb, data){
            sessionStorage.setItem(tsb,JSON.stringify(data));
            //update the hard disk display
            Control.updateDiskDisplay(tsb);
        }
    }
}