---
layout: post
title: "Stack Frame Epilogues"
date: 2022-05-01
categories: [x86]
---
<br> 
On the x86 architecture, 
[stack frames]({% post_url 2023-05-01-x86-stack-frames %}) end with sequence of 
instructions inserted into the binary by the compiler, often referred to as the 
*epilogue*. The epilogue serves the purpose of:  
<br>
1) Destroying the stack frame for the returning function,  
2) Restoring the EBP register to contain the 
[base pointer]({% post_url 2023-05-01-x86-base-pointer %}) of the calling 
function which we are returning to.   
<br> 
Typically the epilogue will look like so:  
```nasm
; x86 Stack Frame Epilogue - Intel Syntax

leave
ret
```  
<br> 
The [leave]({% post_url 2023-05-01-x86-leave-instruction %}) instruction will 
tear down the stack frame and restore the saved frame pointer to get ready to 
return to the calling function. The 
[ret]({% post_url 2023-05-01-x86-ret-instruction %}) instruction will continue 
execution back to the *return address* which is now located at the top of the 
stack (i.e. ESP is pointing to the return address) and was placed there during 
the original *call* instruction to the function we are about to exit.  
