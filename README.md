# webgl-mem
weird little test if firefox can load more data than chromium

https://vegarringdal.github.io/webgl-mem/


## Browsers
* Chrome - Version 131.0.6778.109 (Official Build) (64-bit)
*  Edge - Version 131.0.2903.70 (Official build) (64-bit)
*  Firefox - 133.0



## Tested PCs:

### Dell precision 7680 - 32gig memory, nvidia rtx 3500 ada 
  * windows 10
  * driver version 31.0.15.3770 / 18.10.2023
  * directX version 12(FL 12.1)

Tests:
  * 3 tabs with 50 spheres
        * Firefox OK
        * Edge/chrome, fails on sphere 37 on tab number 2
  * 1 tab with 100 spheres
        * Firefox OK
        * Edge/chrome - fails around 89


> firefox also manged to do the same on the intel(R) UHD graphics


### Dell latitude 5440 - 16gig memory, iris grahpics 
  * windows 10
  * driver version 31.0.101.5522 / 12.05.2024
  * directX version 12(FL 12.1)

Tests:
  * 1 tabs with 50 spheres
        * Firefox OK
        * Edge/chrome, fails on sphere 30

Looks like I could push ff to around 70-80



