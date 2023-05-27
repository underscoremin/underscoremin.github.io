---
layout: post
title: "Stack Frame Epilogues"
date: 2022-05-01
categories: [x86]
---
<br> 
On the x86 architecture, stack frames end with sequence of instructions often 
labelled the 'epilogue'. The epilogue serves the purpose of destroying the stack
frame and restore the EBP register to contain the base pointer of the calling
function which we are returning to.   
<br> 
Typically the epilogue will look like so:  
```assembly
leave
ret
```  
<br> 
After we perform the *leave* instruction the last part of the epilogue is the 
*ret* instruction which will continue execution back to the address immediately
after the address of the *call* instruction from the calling function.   
