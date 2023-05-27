---
layout: post
title: "x86 - Frame Prologues"
date: 2022-05-01
categories: [x86]
---
   
On the x86 architecture, stack frames begin with sequence of instructions often 
labelled the 'prologue'. The prologue serves the purpose of storing the previous
function's base pointer so it can be restored later when this function is 
returning, as well as setting up the base pointer for this stack frame and 
creating space for the functions local variables.   
   
```asm
; x86 Stack Epilogue Instruction

push ebp        ; Save the calling function's base pointer on the stack to be 
                ; restored in this stack frames epilogue

mov ebp, esp    ; Setup the current stack frames base pointer. It is set to 
                ; the value of ESP because ESP points to the top of the stack
                ; and the top of the stack is where we will begin to create 
                ; our new stack frame for the currently executing function

sub esp, 0xX    ; Make room for local variables created in this function, on the 
                ; stack. Before this instruction the base pointer and the stack 
                ; pointer point to the same thing hence you can consider the 
                ; current size of this stack frame to be 0. Since the stack 
                ; grows downards, we minus a value (X) from the current ESP 
                ; location to create new space on the stack.  
```   
