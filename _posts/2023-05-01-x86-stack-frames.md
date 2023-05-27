---
layout: post
title: "x86 - Stack Frames"
date: 2022-05-01
categories: [x86]
---
    
A stack frame is an designation of a segment of the process's stack for each 
function that is called. It was designed this way so that each function can 
execute without having to know it position in the process's stack. This is 
because each stack frame tracks its starting address (known as the base address
of the stack frame) inside the Extended Base Pointer (EBP) register. It can then 
reference the arguments passed to that function as well as its local variables 
as a offset from the address in the EBP register. The EBP register will hold the 
base address for the function that is currently executing (function B), and will 
be updated for a new function called by function B (function C), or when 
returning to the function that called function B (function A). The managing of 
the base address in the EBP register is done through the setup and tear down of 
a functions stack frame (often referred to as the prologue and epilogue 
respectively).    
    
Another reason for functions to be handled this way is so that a function's 
stack frame is always executed at the top of the stack and grows into new space. 
This saves the function from having to track the size of it's own stack frame
as well as other functions' stacks frames to ensure there is no overlap. Since 
the currently executing function's stack frame is at the top of the stack its
only ever growing into new, unused stack space (up to the size limit for the 
that processes stack).    
