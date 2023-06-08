---
layout: post
title: "PLT -> GOT Linking Walkthrough"
date: 2022-05-01
categories: [x86]
---
<br> 
In dynamically linked ELF files, functions used from shared memory need to be 
linked into the executable at runtime. This is because the executable does not
contain its own copy of the function and hence does not know its address.  
<br> 
Linking functions is done through the use of the *Procedure Linkage Table 
(**PLT**)* as well as the *Global Offset Table (**GOT**)*.  
<br> 
The general sequence of events is:
<br>    
1) On the first call to a functions that needs to be dynamically loaded, you
will call the PLT stub for that function.  
2) The PLT stub will then take you to the GOT table entry for that function.  
3) Since it is the first time you are calling this function the GOT table will 
actually return you back to the PLT stub for that specific function (where you 
just came from).  
4) Where the GOT returned you to will be an instruction to jump to the dynamic 
linker which sits lower in memory within the PLT (near the beginning of where 
the PLT section got loaded into memory).   
5) The dynamic linker will then find the actual function in shared memory and 
then update that functions entry in the GOT table to point to the actual 
executable code for the linked function instead of pointing back to the PLT.   
6) Now all subsequent calls to that function will go to it's entry in the PLT 
just like before which will take it to the GOT just like before, but now the 
GOT will point to actual address to jump to in memory to execute the function.
<br>     
You can view the *.plt* and *.plt.got* section of the ELF file and observe 
the functions that will need to be linked.  
<br>   
``` bash
objdump -d <binary_name> -mi386:intel
```   
<br>
``` ObjDump
Output:
... Other Disassembled Sections ...

Disassembly of section .plt:

00001020 <__libc_start_main@plt-0x10>:
    1020:	ff b3 04 00 00 00    	push   DWORD PTR [ebx+0x4]
    1026:	ff a3 08 00 00 00    	jmp    DWORD PTR [ebx+0x8]
    102c:	00 00                	add    BYTE PTR [eax],al
	...

00001030 <__libc_start_main@plt>:
    1030:	ff a3 0c 00 00 00    	jmp    DWORD PTR [ebx+0xc]
    1036:	68 00 00 00 00       	push   0x0
    103b:	e9 e0 ff ff ff       	jmp    1020 <_init+0x20>

00001040 <printf@plt>:
    1040:	ff a3 10 00 00 00    	jmp    DWORD PTR [ebx+0x10]
    1046:	68 08 00 00 00       	push   0x8
    104b:	e9 d0 ff ff ff       	jmp    1020 <_init+0x20>

00001050 <getchar@plt>:
    1050:	ff a3 14 00 00 00    	jmp    DWORD PTR [ebx+0x14]
    1056:	68 10 00 00 00       	push   0x10
    105b:	e9 c0 ff ff ff       	jmp    1020 <_init+0x20>

Disassembly of section .plt.got:

00001060 <__cxa_finalize@plt>:
    1060:	ff a3 f0 ff ff ff    	jmp    DWORD PTR [ebx-0x10]
    1066:	66 90                	xchg   ax,ax

... Other Disassembled Sections ...
```
<br>  
The EBX register in all of the output above will be pointing to the Global 
Offset Table. We will be looking at *printf@plt* as an example. First you should
notice that the memory addresses are all quite small, and this is because these
values are just offsets, Relative Virtual Addresses (RVAs), once this executable
is actually loaded into memory, these RVAs will be applied to the base address
of the executable in memory.
<br>     
You can see the first instruction inside *printf@plt* is to jmp to the address
held at ebp+0x10. As mentioned before EBP is holding the address of the GOT and 
so 0x10 is just an offset into that table - presumably the offset of the printf
entry that table.
<br>    
To actually be able to inspect these values we need to run the executable and 
inspect it with gdb. It's important to note that if we want to watch the dynamic
linking process occur we need to break before the first call to the function 
that we want to inspect, otherwise it will already have been linked. If you were
to break before the first call to printf@plt then you will be able to inspect 
the PLT in gdb like so:
<br>      
```GDB
pwndbg> plt
    Section .plt 0x565fa020-0x565fa060:
    0x565fa030: __libc_start_main@plt
    0x565fa040: printf@plt
    0x565fa050: getchar@plt
```
<br>
From this we can see that the printf PLT entry is at 0x56610040. If we were to 
inspect this address and look at the instruction in the PLT entry we would see
something like:  
<br>
```bash
pwndbg> x/3i 0x56610040
    0x565fa040 <printf@plt>:	jmp    DWORD PTR [ebx+0x10]
    0x565fa046 <printf@plt+6>:	push   0x8
    0x565fa04b <printf@plt+11>:	jmp    0x565fa020
```
<br>
This looks pretty identical to the structure we saw in the PLT displayed by 
objdump, however now we have proper addresses. So if someone were to call 
printf@plt for the first time, the first instruction after the call they would
execute is:
<br>
```
0x565fa040 <printf@plt>:	jmp    DWORD PTR [ebx+0x10]
```
<br>
This is indexing into the GOT by 0x10, dereferencing that address and jumping to 
it. Lets break that down a little, first lets have a look at where the GOT is in 
memory and what it contains there. First i mentioned that EBX holds the value
of the GOT, I got this information from gdb i.e.:   
```bash
EBX  0x565fcff4 (_GLOBAL_OFFSET_TABLE_) ◂— 0x3ef0
```
<br>
If we use *vmmap* to look at the memory layout of our process we will see that 
the GOT address (EBP+0x10 = 0x565fd004) resides in the *DATA* segment (It isn't 
color coded here so you will have to take my word for it):   
<br>  
```bash
0x565f9000 0x565fa000 r--p     1000      0 /root/example
0x565fa000 0x565fb000 r-xp     1000   1000 /root/example
0x565fb000 0x565fc000 r--p     1000   2000 /root/example
0x565fc000 0x565fd000 r--p     1000   2000 /root/example
**0x565fd000 0x565fe000** rw-p     1000   3000 /root/example
0x56ce6000 0x56d08000 rw-p    22000      0 [heap]
0xf7cfb000 0xf7d1d000 r--p    22000      0 /usr/lib/i386-linux-gnu/libc.so.6
0xf7d1d000 0xf7e96000 r-xp   179000  22000 /usr/lib/i386-linux-gnu/libc.so.6
0xf7e96000 0xf7f16000 r--p    80000 19b000 /usr/lib/i386-linux-gnu/libc.so.6
0xf7f16000 0xf7f18000 r--p     2000 21b000 /usr/lib/i386-linux-gnu/libc.so.6
0xf7f18000 0xf7f19000 rw-p     1000 21d000 /usr/lib/i386-linux-gnu/libc.so.6
0xf7f19000 0xf7f23000 rw-p     a000      0 [anon_f7f19]
0xf7f2f000 0xf7f31000 rw-p     2000      0 [anon_f7f2f]
0xf7f31000 0xf7f35000 r--p     4000      0 [vvar]
0xf7f35000 0xf7f37000 r-xp     2000      0 [vdso]
0xf7f37000 0xf7f38000 r--p     1000      0 /usr/lib/i386-linux-gnu/ld-linux.so.2
0xf7f38000 0xf7f5b000 r-xp    23000   1000 /usr/lib/i386-linux-gnu/ld-linux.so.2
0xf7f5b000 0xf7f69000 r--p     e000  24000 /usr/lib/i386-linux-gnu/ld-linux.so.2
0xf7f69000 0xf7f6b000 r--p     2000  31000 /usr/lib/i386-linux-gnu/ld-linux.so.2
0xf7f6b000 0xf7f6c000 rw-p     1000  33000 /usr/lib/i386-linux-gnu/ld-linux.so.2
0xff984000 0xff9a5000 rw-p    21000      0 [stack]
```
<br>
There isn't instruction in the DATA section, so instead of using x/i to view 
the instructions like we did the in the PLT we will just use x/a to view the
addresses stored in the GOT:   
<br>
```bash
pwndbg> x/a $ebx+0x10
    0x565fd004 <printf@got.plt>:	0x565fa046
```
<br>
Notice how GDB has labeled that the address we are inspecting is the address of
printf@got.plt i.e. printf's entry in the GOT table. This address hold a another
address '0x565fa046'. If we look back earlier in the post, the instruction in 
the printf@plt stub was to jump to whatever value as stored in memory at 
$EBP+0x10, so it wants us to jump to 0x565fa046 but what is there?  
<br>
```bash
pwndbg> x/3i 0x565fa046
    0x565fa046 <printf@plt+6>:	push   0x8
    0x565fa04b <printf@plt+11>:	jmp    0x565fa020
    0x565fa050 <getchar@plt>:	jmp    DWORD PTR [ebx+0x14]
```
<br>
Its actually just jumping right back to where we came from, this is because this
is the first call to printf and it has not been linked yet. It will push 0x8 
onto the stack and then it will jump to 0x565fa020 which just happens to be:  
<br>
```bash
pwndbg> x/10i 0x565fa020
    0x565fa020:	push   DWORD PTR [ebx+0x4]  
    0x565fa026:	jmp    DWORD PTR [ebx+0x8]
    0x565fa02c:	add    BYTE PTR [eax],al
    0x565fa02e:	add    BYTE PTR [eax],al
    0x565fa030 <__libc_start_main@plt>:	jmp    DWORD PTR [ebx+0xc]
    0x565fa036 <__libc_start_main@plt+6>:	push   0x0
    0x565fa03b <__libc_start_main@plt+11>:	jmp    0x565fa020
    0x565fa040 <printf@plt>:	jmp    DWORD PTR [ebx+0x10]
    0x565fa046 <printf@plt+6>:	push   0x8
    0x565fa04b <printf@plt+11>:	jmp    0x565fa020
```
<br>
just slightly further up in the PLT. Near the beginning of the PLT you will have
your dynamic linker which all PLT stubs will have to go through to link their 
respective functions.  
<br>  
```
0x565fa020:	push   DWORD PTR [ebx+0x4]  : Pushes the ELF magic bytes onto the 
                                        ; stack presumably as a argument for the
                                        ; linker to use.
```
<br>
Now we are jumping to ebx+0x8, we know ebx is the GOT, we know that ebx+0x10 is 
the offset into the GOT for the printf entry, what about an offset of 0x8?  
<br>
```bash
pwndbg> x/a $ebx+0x8
    0x565fcffc:	0xf7f498c0
pwndbg> x/i 0xf7f498c0
    0xf7f498c0 <_dl_runtime_resolve>:	push   eax
```
<br>
At $ebx+0x8 it stores the address 0xf7f498c0, which is jumped to, and we can 
see from next line, that 0xf7f498c0 is the address of the dynamic runtime linker
runtime resolver. This function is what will actually go and find the address of
printf and then update the value of the GOT with the address of the printf 
function for subsequent calls. If we were to break at the second use of printf 
and inspect where its jumping to we will see a similar PLT but a different GOT
for example, this is right before out second call to printf:   
<br>
```bash
Section .plt 0x565fa020-0x565fa060:
    0x565fa030: __libc_start_main@plt
    0x565fa040: printf@plt
    0x565fa050: getchar@plt
pwndbg> x/3i 0x565fa040
    0x565fa040 <printf@plt>:	jmp    DWORD PTR [ebx+0x10]
    0x565fa046 <printf@plt+6>:	push   0x8
    0x565fa04b <printf@plt+11>:	jmp    0x565fa020
```
<br>
We can see that the PLT looks the same, what about when we inspect what value 
is stored at ebx+0x10?  
<br>
```bash
pwndbg> x/a $ebx+0x10
    0x565fd004 <printf@got.plt>:	0xf7d4ee40
pwndbg> x/3i 0xf7d4ee40
    0xf7d4ee40 <__printf>:	call   0xf7e69d4d <__x86.get_pc_thunk.ax>
    0xf7d4ee45 <__printf+5>:	add    eax,0x1c91af
    0xf7d4ee4a <__printf+10>:	sub    esp,0xc
```
<br>
We can see that ebx+0x10 still points to the printf entry in the GOT, but now
it is storing a different value, instead of jumping back to the PLT like it did
the first time, it now points to 0xf7d4ee40 which is the first instruction in 
printf.
