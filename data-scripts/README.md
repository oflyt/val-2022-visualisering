```
root 
│
└───data-collected
│   │   2018_K_per_kommun.xlsx <---
│   │   2018_L_per_kommun.xlsx <-- https://data.val.se/val/val2018/statistik/index.html
│   │   2018_R_per_kommun.xlsx <---
│   │   deltagande-partier.csv <-- https://www.val.se/for-partier/anmalda-partier.html
|   |   party-code-websites.csv <-- Hand-made with columns: party, party_code, url, comment
|   |   party-color.csv <-- Hand-made with columns: party, color (https://sv.wikipedia.org/wiki/Kategori:Sveriges_partif%C3%A4rgsmallar, https://sv.wikipedia.org/wiki/Mall:Partif%C3%A4rg)
│   │
│   └───sverige-geodata <-- https://www.scb.se/hitta-statistik/regional-statistik-och-kartor/regionala-indelningar/digitala-granser/
│       │
│       └───KommunSweref99TM
│       │   Kommun_Sweref99TM_region.dbf
│       │   Kommun_Sweref99TM_region.prj
│       │   Kommun_Sweref99TM_region.shp
│       │   Kommun_Sweref99TM_region.shx
│       │
│       └───LanSweref99TM
│       │   Lan_Sweref99TM_region.dbf
│       │   Lan_Sweref99TM_region.prj
│       │   Lan_Sweref99TM_region.shp
│       │   Lan_Sweref99TM_region.shx
│
└───data-scripts
    │   geodata.py <-- Create geojsons
    │   party-statistics.py <-- Create lists of parties
```