IzuraOS
=================================================

Shell Commands:
ver - Displays the current version data.
shutdown - Shuts down the virtual OS but leaves the underlying host/hardware simulation running.
cls - Clears the screen and resets the cursor position.
man <topic> - Displays the manual page for for <topic>.
trace <on | off> - Turns the OS tace on or off.
prompt <string> - Sets the prompt.
date - Displays the current date and time.
status <string> - Sets a status message.
bsod - Will crash the OS.
load - Validate the user code.
run <pid> - Runs the process according to the id.
clearmem - Will clear all memory.
runall - Will run all programs.
ps - Display the PID and the state of all processes.
kill - Kill one process.
killall - Kill all processes,
quantum - Let the user set the Round Robin quantum (measured in cpu cycles).
format - Initialize all blocks in all sectors in all tracks.
ls - List the Giles currently stored on the disk
create <filename> - Create the file.
read <filename> - Read and display the contents of filename.
write <filename> - Write the data inside the quotes to filename.
delete <filename> - Remove filename form storage.
getschedule - Currently selected CPU scheduling algorithm.
setschedule <schedule> - Select a CPU scheduling algorithm (RR, FCFS, Priority).

Setup TypeScript
================

1. Install the [npm](https://www.npmjs.org/) package manager if you don't already have it.
1. Run `npm install -g typescript` to get the TypeScript Compiler. (You may need to do this as root.)


Workflow
=============

Some IDEs (e.g., Visual Studio Code, IntelliJ, others) natively support TypeScript-to-JavaScript compilation.
If your development environment does not then you'll need to automate the process with something like Gulp.


- Setup Gulp
1. `npm install -g gulp` to get the Gulp Task Runner.
1. `npm install -g gulp-tsc` to get the Gulp TypeScript plugin.


Run `gulp` at the command line in the root directory of this project.
Edit your TypeScript files in the source/scripts directory in your favorite editor.
Visual Studio and IntelliJ have some tools that make debugging, syntax highlighting, and lots more quite easy.
WebStorm looks like a nice option as well.

Gulp will automatically:

* Watch for changes in your source/scripts/ directory for changes to .ts files and run the TypeScript Compiler on them.
* Watch for changes to your source/styles/ directory for changes to .css files and copy them to the distrib/ folder if you have them there.
