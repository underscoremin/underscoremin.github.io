---
layout: post
title: "'leave' Instruction"
date: 2022-05-01
categories: [x86]
---
<br> 
The *leave* instruction is actually a combination of a few individual 
instructions. Because the functionality provided by the atomic instructions 
within leave are required so often, leave was introduced to reduce the space 
taken up in the processor cache. The leave instruction is a combination of the 
following:   
<br> 
```
; *leave* instruction equivilent 

mov esp ebp     ; This is destroying the stack frame by moving the stack pointer 
                ; (ESP) from where it is all the way to the base of the stack 
                ; frame essentially making the size of the stack frame 0 i.e. 
                ; it contains no addresses within the bounds of where ESP is 
                ; pointing to on the stack and where EBP is pointing to as they 
                ; are pointing to the same thing.
                            
pop ebp         ; This is now restoring the value of EBP to be the previous 
                ; stack frame's base pointer.
```
