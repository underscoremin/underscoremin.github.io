---
layout: post
title: "'ret' Instruction"
date: 2022-05-01
categories: [x86]
---
<br>    
The *ret* instruction is not a real instruction per say, it get converted to a 
*retn* or a *retf* standing for "Return Near" and "Return Far" respectively. 
This depends on where you are returning to in memory.   
<br>    
Generally speaking a *ret* will:    
```asm
pop eip
jmp eip
```    
<br>    
A *ret* can be provided a value, i.e.```ret 4``` which is typically used in
calling conventions where the callee cleans up the stack. A ```ret 4``` will 
return to the caller and then add 4 to ESP to remove the pushed arguement to 
the function that was just returned from, off the stack.     
<br>    
E.g. if you passed a function two integers (assuming they are 4 bytes each) you
would likely see a ```ret 8``` within the called function to clean up those two
arguments from the stack once returned.    
<br>    
For the cdecl calling convention, the caller is expected to clean up the stack 
not the callee. So with cdecl functions you will often just see a *ret* at the
end of the function, then immediately after you return execution to the caller 
you will see a value to be added to the ESP value depending on how many 
arguments were passed to the function that was just returned and any other 
values that were pushed onto the stack during the execution of those functions.
