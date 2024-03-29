---
layout: post
title: "Base Pointers (Frame Pointers)"
date: 2022-05-01
categories: [x86]
---
<br> 
The base pointer on the x86 architecture serves two purposes:  
<br> 
1) The address of the base pointer (stored in EBP) is a reference to the base of 
the current [stack frame]({% post_url 2023-05-01-x86-stack-frames %}), enabling 
you to access function arguments and local variables as an offset from the 
address in EBP.   
<br> 
2) The **value** stored at the address EBP contains is the stack address of the 
previous stack frame's base address. This is setup in the 
[stack prologue]({% post_url 2023-05-01-x86-frame-prologues %}) when you:  
<br> 
```nasm
; Snippet of the stack prologue - Intel Syntax 

push ebp        ; Store the calling functions base pointer on the stack, often
                ; referred to as the 'Saved Frame Pointer (SFP)'

mov ebp, esp    ; Set the base pointer for the function that was just entered
                ; by setting it equal to the top of the stack. 
```  
<br> 
If you look at the EBP register in GDB you will see that it looks like a list of 
stack addresses. The base address for the current stack frame, holds the base 
address of the previous stack frame which holds the base address of the stack 
frame before that and so on. At the point in time when we *pop ebp* in the 
[epilogue]({% post_url 2023-05-01-x86-frame-epilogues %}), the top of the stack 
will point to the base of the current stack frame (thanks to the instruction 
just prior to this one), i.e. ESP and EBP will point to the same address, when 
we *pop ebp* we take the **value** of the address that ESP is pointing to i.e. 
The value at the address address of the base pointer (the previous stack frame's 
base address) and we place it inside EBP thus restoring EBP for the previous 
stack frame ready for us to return to the calling function.   
