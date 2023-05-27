---
layout: post
title: "x86 - Frame Epilogues"
date: 2022-05-01
categories: [x86]
---
   
On the x86 architecture, stack frames end with sequence of instructions often 
labelled the 'epilogue'. The epilogue serves the purpose of destroying the stack
frame and restore the EBP register to contain the base pointer of the calling
function which we are returning to.   
  
Typically the epilogue will look like so:  
```asm
leave
ret
```  
  
After we perform the *leave* instruction the last part of the epilogue is the 
*ret* instruction which will continue execution back to the address immediately
after the address of the *call* instruction from the calling function.   
