# Command Line Error

Most command line programs under-utilize the ability to use multiple non-zero
exit codes to indicate the type of error encountered, typically most programs
exit with an exit status of `1` which gives no indication of what type of
error occured.

The benefit of using multiple non-zero exit codes is that it is much easier to *programatically* determine the type of error that occured when invoking a program from another program without parsing `stderr`.

If a program documents it's exit status codes then a callee can ignore `stderr` and provide it's own indication of the type of error that occured.

This module is a set of helper functions and an error class designed to add designers of command line interfaces to structure their error handling around pre-defined error instances with different non-zero exit codes.
