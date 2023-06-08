---
layout: post
title: "Stack Frame Prologues"
date: 2022-05-01
categories: [x86]
---
<br> 
On the x86 architecture, 
[stack frames]({% post_url 2023-05-01-x86-stack-frames %}) begin with sequence 
of instructions often referred to as the *prologue*. The prologue is inserted by 
the compiler into the binary to manage various information required to perform a 
function call. The prologue on x86 serves the purpose of:
<br>  
1) Storing the previous function's 
[base pointer]({% post_url 2023-05-01-x86-base-pointer %}) so it can be restored 
later when this function is returning,   
   
2) Setting up the base pointer for this stack frame,  
  
3) Creating space on the stack for the functions local variables.   
<br> 
```nasm
; x86 Stack Prologue Instruction - Intel Syntax

push ebp        ; Save the calling function's base pointer on the stack to be 
                ; restored in this stack frames epilogue

mov ebp, esp    ; Setup the current stack frames base pointer. It is set to 
                ; the value of ESP because ESP points to the top of the stack
                ; and the top of the stack is where we will begin to create 
                ; our new stack frame for the currently executing function

sub esp, 0x8    ; Make room for this function's local variables on the stack. 
                ; Before executing this instruction, the base pointer (EBP) and 
                ; the stack pointer (ESP) point to the same thing, hence you can 
                ; consider the current size of this stack frame to be 0. Since 
                ; the stack grows downards, we minus a value (in this case I 
                ; chose 0x8 at random) from the current ESP location to create 
                ; new space on the stack for local function variables. In this 
                ; example you might have 2 variables each of size 0x4 bytes or
                ; you may have one variable with a size of 0x8 bytes. 
```   
