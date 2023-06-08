---
layout: post
title: "'ret' Instruction"
date: 2022-05-01
categories: [x86]
---
<br>    
The *ret* instruction is not a real instruction per say, it gets converted to a 
*retn* or a *retf*, standing for "Return Near" and "Return Far" respectively. 
This depends on where you are returning to in memory. A retn is for when you are 
returning to an address within the same segment you are currently in, and a retf 
is for when you return to a different segment.   
<br>    
Generally speaking a *retn* will:    
```nasm
pop eip     ; This operation has two effects: 1) it will remove the return 
            ; address from the top of the stack and place it into the EIP 
            ; register. 2) Since it was placed within the EIP register which 
            ; always points to the currently executing instruction in memory,
            ; execution will now jump to that address and continue executing 
            ; from there.
```    
<br>    
A *ret* can be provided a value, e.g. *ret 4* which is typically used in
calling conventions where the callee cleans up the stack. A *ret 4* will return 
to the caller and then add 4 to ESP to remove the pushed argument to the 
function that was just returned from off the stack.  
<br>    
*Example*: If you passed a function two integers (assuming they are 4 bytes 
each) you would likely see a *ret 8* within the called function to clean up 
those two arguments from the stack once returned.  
<br>    
For the cdecl calling convention, the caller is expected to clean up the stack 
not the callee. So with cdecl functions you will often just see a *ret* at the
end of the function, then immediately after you return execution to the caller 
you will see a value to be added to the ESP value depending on how many 
arguments were passed to the function that was just returned from and any other 
values that were pushed onto the stack during the execution of those functions.
