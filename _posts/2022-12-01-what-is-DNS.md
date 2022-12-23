---
layout: post
title: "What is DNS"
date: 2022-12-01
categories: [DNS]
---

<br> 
**Domain Name System** (**DNS**) is the system computers use to convert domain 
names e.g. *example.com* into IP addresses of computers on the internet. This
occurs in a lot of different places, however likely the most familiar occurrence 
is when you visit a webpage. More often than not you browse to webpages not 
using an IP address but instead a readable domain name; It is not clear to a 
computer where on the internet to look for that domain name, so it must first be 
converted to an IP address using DNS.  
<br> 

## Why DNS
Computers on Internet Protocol (IP) networks -- this includes the internet --  
identify themselves with IP addresses. To access other computers on the 
internet, you need to know what their IP address is. However, IP addresses are 
hard to read and harder to remember but domain names offer a human friendly way 
to reference a computer instead. This might be better for us, but computers 
still communicate to each other using their IPs. Hence, the reason why we need 
DNS: To convert domain name into IP addresses so a computer knows who to 
communicate to.   
<br> 

## DNS Namespace 
DNS is a namespace:   
> A namespace is a context within which the names of all objects must be 
unambiguously resolvable. For example, the internet is a single DNS namespace.   
>  
> -- <cite>https://learn.microsoft.com/en-us/windows/win32/dns/name-space</cite>     
<br>   

The DNS namespace is a hierarchical tree like structure of domains. Each domain
can be called a subdomain of whatever node is its parent in the namespace (
except for the root domain which has no parent).     
<br>   

Leaf domains (domains at the bottom of a branch in the DNS namespace) often have 
a mapping to a IP address of a computer on the internet. Whereas domains in the 
middle of the DNS namespace can either be a host as well or they could point to 
a nameserver instead.   
<br>   

## Constructing a Domain Name
We identify a domain by its location in the DNS namespace tree. Starting from 
the root of the tree (the Root Domain) each child node's domain name will be 
constructed of \<its own domain name\>.\<domain name of its parent\>. (Notice 
that each component of a domain name is separated by a period '.').   
<br>   
  
**NOTE**: The root domain doesn't actually have a domain name, or rather its 
domain name is a empty string. You will often see the root domain being 
portrayed as a singular period '.' by itself and you have to imagine the 
empty string following it. This is how we will represent the root domain in the 
rest of the post.    
<br>

The full path of a domain from the root of the DNS name space is called a 
**Fully Qualified Domain Name** (**FQDN**) whereas a **Partially Qualified 
Domain Name** (**PQDN**) aka **Relative Domain Name** is a subset of a 
FQDN, commonly used to just specify the host e.g example.com whereas the FQDN 
for example's web server is www.example.com. (with the trailing period to 
represent the root).  
<br>

Deconstructing the FQDN 'www.example.com' into its position in the DNS namespace
would look like so:      
<br> 
<div class="mermaid"> 
flowchart TD
    subgraph &nbsp&nbspRoot Domain&nbsp&nbsp
        root(.)
    end
    root -- &nbspParent of '.com' Top Level Domain&nbsp --> com(.com.)
    com -- &nbspParent of '.example' Second Level Domain&nbsp --> example(.example.com.)
    example -- &nbspParent of 'www' subdomain&nbsp --> www(www.example.com.)
    subgraph res [<br><br><br><br><br><br>&nbsp&nbspFully Qualified Domain Name&nbsp&nbsp]
        www
    end

    classDef result line-height:1;
    class res result;
</div>   
You might notice that our resulting domain name above ends in a period. This is 
true for all domains as they all branch off from the root. However because this 
is common in every scenario, the need to write it has been made redundant and 
the trailing period on all domains is actually implied.  
<br> 
### DNS Tree Structure 
At the top of the DNS namespace is the **Root Domain** and is identified by the 
empty label.  
<br> 
<div class="mermaid">
flowchart LR
    subgraph Root
        root(.)
    end
</div>
<br> 

Underneath the root domains you have the **Top Level Domains** (**TLDs**), 
some examples are:    
<br> 

<div class="mermaid"> 
flowchart LR
    subgraph Root
        root(.)
    end
    subgraph &nbsp&nbspTop Level Domains&nbsp&nbsp
        root --> com(.com)
        root --> edu(.edu)
        root --> org(.org)
        root --> net(.net)
        root --> ...(...)
    end
</div>   
<br> 

Underneath the TLDs you have **Second Level Domains** (**SLDs**). These are
often the domain names individuals and companies buy to host their websites, for
example:    
<br> 

<div class="mermaid">
flowchart LR
    subgraph Root
        root(.)
    end
    subgraph TLD [&nbsp&nbspTop Level Domains&nbsp&nbsp]
        root --> com(.com)
        root --> org(.org)
        root --> ...(...)
    end
    subgraph SLD [Second Level Domains]
        com --> google(google.com)
        com --> 2...(...)
        org --> wiki(wikipedia.org)
        org --> 3...(...)
    end 
</div>     
<br> 

Underneath the Second Level Domains you have **Third Level Domains** . Third 
Level domains are commonly referred to as **subdomains** however, technically 
all domains are subdomains of their parents. Some examples of third level 
domains are:    
<br> 

<div class="mermaid">
flowchart LR
    subgraph Root
        root(.)
    end
    subgraph TLD [&nbsp&nbspTop Level Domains&nbsp&nbsp]
        root --> com(.com)
        root --> TLD...(...)
    end
    subgraph SLD [&nbsp&nbspSecond Level Domains&nbsp&nbsp]
        com --> google(google.com)
        com --> SLD...(...)
    end 
    subgraph ThLD [&nbsp&nbspThird Level Domains&nbsp&nbsp]
        google --> www(www.google.com)
        google --> mail(mail.google.com)
        google --> ThirdLevelDomain...(...)
    end 
</div>     
<br> 

## DNS Zones
A DNS zone is a subsection of the DNS namespace that is managed by one entity. 
The difference between a zone and a domain is that its possible for a whole 
domain to be a zone (in that scenario they would be synonymous) but its also 
possible for a single domain to be comprised of many zones and this often 
happens with the higher level domains. Take the .com domain for example, a lot 
of the subdomains under .com will be delegated to the entities that purchase 
those domains to handle like facebook.com, google.com, youtube.com etc. What is 
left over for the .com zone to manage is mostly delegation information like "
who did I delegate to manage the facebook.com domain" and so on. 
<br> 

A simply diagram of what zones 

<div class="mermaid">
flowchart TD
    subgraph Zone managed by ICANN
        root(.)
    end
    root-->com...(...)
    subgraph .comDomain [<b>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp.com Domain</b>]
        subgraph Zone &nbsp&nbsp&nbspmanaged &nbsp&nbsp&nbspby &nbsp&nbsp&nbspVerisign
            root --> com(.com)
        end
        subgraph Zone &nbspmanaged &nbspby &nbspGoogle
            com --&nbspDelegated from Verisign&nbsp--> google(google.com)
            google --> gwww(www.google.com)
            google --> g...(...)
        end 
        subgraph Zone &nbsp&nbsp&nbspmanaged &nbsp&nbsp&nbspby &nbsp&nbsp&nbspFacebook 
            com --&nbspDelegated from Verisign&nbsp--> facebook(facebook.com)
            facebook --> fwww(www.facebook.com)
            facebook --> f...(...)
        end 
    end
</div>     
<br> 

## Zone Files (Resource Records)


## Converting a Domain Name to an IP - Step by Step 
Your computer will have a local DNS client which provides name qualification as
well a local DNS cache store to resolve queries that have been cached from a 
previous DNS query.  
<br> 

### What is Name Qualification
Name Qualification is the process of turning a PQDN into a FQDN. Most often this 
is simply adding a full stop to the end of the domain name to represent to the 
root level domain. 

also known as a stub-resolver, which 
applications (most commonly your browser) will query when they want a domain 
name resolved to an IP address. 

The stub-resolver acts as a intermediary and simply forwards this request to a 
DNS resolver often located within a DNS server sitting at your Internet Service 
Provider (ISP). 

A DNS resolver and a DNS server are fairly interchangeable in that a DNS servers 
purpose is to provide its DNS resolving capabilities to its clients 
(stub-resolver)

A DNS resolver is what actually uncovers the IP address. It does this by first 
querying one of the thirteen global root nameservers.  





