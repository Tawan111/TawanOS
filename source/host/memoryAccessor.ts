/* ------------
     memoryAccessor.ts
     
     ------------ */
module TSOS {

    export class MemoryAccessor {
           
        //three partitions for next project
        public partition0 = false;
        public partition1 = false;
        public partition2 = false;

        public init(): void {
            //free partitions and update the memory display
            this.partition0 = false;
            this.partition1 = false;
            this.partition2 = false;
            _Memory.memDisplay();
        }
        //find and read the partition
        public findPart(part, max) {
            //TODO
        }
        //will write the partition
        public usePart(part, arr, data){
            //TODO
           _Memory.updateMemDisplay(part);
        }
    }
} 