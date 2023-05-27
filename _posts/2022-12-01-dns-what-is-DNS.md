---
layout: post
title: "What is DNS"
date: 2022-12-01
categories: [DNS]
---

<br> 
**Domain Name System** (**DNS**) is the system computers use to convert **Domain 
Names** e.g. *www.example.com* into IP addresses. DNS gets used throughout many 
common computer activities, however, *you* are likely to invoke it the most by 
browsing the web. More often than not you browse to a website not using its IP 
address but instead a readable domain name. It is not clear to a computer where 
on the internet to look for that domain name, so it must first be converted to 
an IP address using DNS.  
<br> 

## Why DNS
Computers on the internet -- more specifically **Internet Protocol** (**IP**) 
networks -- identify themselves with IP addresses. To access other computers on 
the internet, you need to know what their IP address is. However, IP addresses 
are hard to read and harder to remember, but domain names offer a human friendly 
way to reference a destination on the internet instead. This might be better for 
us, but computers still communicate to each other using their IPs. Hence, the 
reason why we need DNS.  
<br> 

## Domain Name System Layout 
The Domain Name System can be described as a **Namespace**:   
> A namespace is a context within which the names of all objects must be 
unambiguously resolvable. For example, the internet is a single DNS namespace.   
>  
> -- <cite>https://learn.microsoft.com/en-us/windows/win32/dns/name-space</cite>     
<br>   

The DNS namespace has a hierarchical tree like structure of **Domains**. A 
domain is any subsection of the whole DNS namespace (it too will also be 
classified as a namespace). Each domain has a label that corresponds to it.   
<br>   

### Domains vs Domain Names
As mentioned above a domain is any subset of the whole DNS namespace, whereas a
domain name is a period ('.') separated label of domains. The domain name 
describes the position of the domain in the DNS namespace starting from the Root
domain (which is at the top of the namespace). '*www.example.com*' is a domain 
name, and '*www*', '*example*', '*com*' are all domains.  
<br>   

### Hierarchical Structure
At the top of the DNS namespace is the **Root Domain** and it is identified by a 
null/empty label. Because empty labels could be confusing to readers, the root 
domain is often instead represented by a single period '.'. It is meant to 
represent the period that separates the domains in a domain name, however I 
think that causes more confusion so instead I will represent the Root domain by 
a empty pair of single quotes: ''. 
<br> 
<div class="mermaid">
flowchart LR
    subgraph rootDomain [&nbsp&nbspRoot Domain&nbsp&nbsp]
        root('')
    end
</div>
<br> 

Underneath the root domain you have the **Top Level Domains** (**TLDs**), 
some examples are:    
<br> 

<div class="mermaid"> 
flowchart RL
    subgraph Root Domain
        root('')
    end
    subgraph &nbsp&nbspTop Level Domains&nbsp&nbsp
        root -- &nbsp.&nbsp --> com(com)
        root -- &nbsp.&nbsp --> edu(edu)
        root -- &nbsp.&nbsp --> org(org)
        root -- &nbsp.&nbsp --> net(net)
        root --> ...(...)
    end
</div>   
<br> 

Underneath the TLDs you have **Second Level Domains** (**SLDs**). These are
often the domains individuals and companies buy to host their websites or other
resources, for example:    
<br> 

<div class="mermaid">
flowchart RL
    subgraph Root
        root('')
    end
    subgraph TLD [&nbsp&nbspTop Level Domains&nbsp&nbsp]
        root -- &nbsp.&nbsp --> com(com)
        root -- &nbsp.&nbsp --> org(org)
        root --> ...(...)
    end
    subgraph SLD [&nbsp&nbspSecond Level Domains&nbsp&nbsp]
        com -- &nbsp.&nbsp --> google(google)
        com --> 2...(...)
        org -- &nbsp.&nbsp --> wiki(wikipedia)
        org --> 3...(...)
    end 
</div>     
<br> 

Underneath the Second Level Domains you have **Third Level Domains**. Third 
Level domains are commonly referred to as **subdomains** however, technically 
all domains are subdomains of their parent (except the Root domain because it
has no parent). Some examples of third level 
domains are:    
<br> 

<div class="mermaid">
flowchart RL
    subgraph Root
        root('')
    end
    subgraph TLD [&nbsp&nbspTop Level Domains&nbsp&nbsp]
        root -- &nbsp.&nbsp --> com(com)
        root --> TLD...(...)
    end
    subgraph SLD [&nbsp&nbspSecond Level Domains&nbsp&nbsp]
        com -- &nbsp.&nbsp --> google(google)
        com --> SLD...(...)
    end 
    subgraph ThLD [&nbsp&nbspThird Level Domains&nbsp&nbsp]
        google -- &nbsp.&nbsp --> www(www)
        google -- &nbsp.&nbsp --> mail(mail)
        google --> ThirdLevelDomain...(...)
    end 
</div>     
<br> 

## Constructing a Domain Name
A domain name is a description of a domains location inside the DNS namespace 
tree. Starting from the root of the tree (the Root Domain) each child domain 
will have a domain name that is constructed of \<its own domain name\>.\<domain 
name of its parent\>.  
<br>   
  
The full path of a domain from the root of the DNS name space is called a 
**Fully Qualified Domain Name** (**FQDN**) whereas a **Partially Qualified 
Domain Name** (**PQDN**) aka **Relative Domain Name** is a subset of a FQDN. 
PQDNs are commonly used to specify just the host e.g example.com whereas the 
FQDN is required when actually 
<br>

Deconstructing the FQDN 'www.example.com.' into its position in the DNS 
namespace would look like so:      
<br> 
<div class="mermaid"> 
flowchart TD
    subgraph &nbsp&nbspRoot Domain&nbsp&nbsp
        root('')
    end
    root -- &nbspParent of '.com' Top Level Domain&nbsp --> com(.com.'')
    com -- &nbspParent of '.example' Second Level Domain&nbsp --> example(.example.com.'')
    example -- &nbspParent of 'www' subdomain&nbsp --> www(www.example.com.'')
    subgraph res [<br><br><br><br><br><br><br>&nbsp&nbspFully Qualified Domain Name&nbsp&nbsp]
        www
    end

    classDef result line-height:1;
    class res result;
</div>   
You might notice that our resulting domain name above ends in a period (followed
by an empty string representing the root domain). This is true for all domains 
as they all branch off from the root. However because this is common in every 
scenario, the need to write the trailing period has been made redundant and on 
all domains it's implied.  
<br> 

## Where is Domain Information Stored
As you might have guessed domains can be quite large. Take the '.com' TLD for 
example, it is comprised of every website in the world that ends with '.com'. It
would be very difficult for one organisation to manage all subdomains of the 
'.com' domain. This is why domains can **Delegate** the management of some of 
its subdomains to the individuals or organisation creating those subdomains. 
These subdomains often then become one or more **DNS Zones**.   
<br> 

### DNS Zones
A DNS zone is a subsection of the DNS namespace that is managed by one entity. 
The difference between a zone and a domain is that it's possible for a whole 
domain to be a zone (in that scenario they would be synonymous) but it's also 
possible for a single domain to be comprised of many zones and this often 
happens with the higher level domains like the '.com' domain example above. The 
'.com' domain will delegate the management of most of its subdomains leaving it 
to manage mostly delegation information like "who did I delegate to manage the 
facebook.com domain" and so on for example:    
<br> 

<div class="mermaid">
flowchart TD
    subgraph Zone managed by ICANN
        root('')
    end
    root-->com...(...)
    subgraph .comDomain [.com Domain&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp]
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

    classDef domainClass font-weight:900;
    class .comDomain domainClass;
</div>     
<br> 

### DNS Nameservers and Resource Records (Zone Files)
Information about zones are stored in **Nameservers**. Nameservers are servers
that are responsible for holding **Resource Records** (**RRs**) aka **Zone 
Files** for a particular zone. RRs are divided up into classes, the only of 
which that holds much relevance today is the **Internet** class. For the 
internet class you have several types of RRs, each type of record holds 
different information about the zone. *Some* of the most common records are:   
<div class="mermaid">
flowchart TB
    subgraph &nbsp&nbspCNAME Record&nbsp&nbsp
        CNAME(CNAME)
    end
    subgraph &nbsp&nbspMX Record&nbsp&nbsp
        MX(MX)
    end
    subgraph &nbsp&nbspAAAA Record&nbsp&nbsp
        AAAA(AAAA)
    end
    subgraph &nbsp&nbspA Record&nbsp&nbsp
        A(A)
    end
</div>     
<br> 

**<u>A Record</u>**: Converts a domain name to an IPv4 address.  
<br> 
**<u>AAAA Record</u>**: Converts a domain name to an IPv6 address.  
<br> 
**<u>MX Record</u>**: Identifies the mail server for a email recipient.    
<br> 
**<u>CNAME Record</u>**: **CNAME** aka **Canonical Name** converts a domain name 
to another domain name. This is sometimes required because domain names can be
setup to act like an alias. This can repeat multiple times until you eventually
reach a domain name that resolves to an IP address for example:    
<br> 

<div class="mermaid">
flowchart LR
    fb(www.facebook.com) -- &nbsp&nbspCNAME Record&nbsp&nbsp --> star(star-mini.c10r.facebook.com)  
    star -- &nbsp&nbspA Record&nbsp&nbsp --> ip(157.240.19.35)
</div>      
<br> 

### Authoritative Nameservers
Authoritative nameservers are nameservers that have all the resource records for 
a zone. A zone can have multiple nameservers, some of which may only contain 
some of the total resource records for a zone, these are just called 
nameservers. Authoritative nameservers are what are queried for resource records 
in the domain name resolution process.   
<br> 

Leaf domains (domains at the bottom of a branch in the DNS namespace) often have 
a mapping to a IP address of a computer on the internet. Whereas domains in the 
middle of the DNS namespace can either be a host as well or they could just 
manage the information about their own domain through the use of nameservers.   
<br>   

