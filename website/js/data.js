class Data {

    static Country = class {
        static parties() {
            return d3.dsv(";", "./data/parties/party-result-country.csv").then(Data.Party.standardizeData);
        }
    }

    static Region = class {
        static geoJson() {
            return d3.json("./data/geodata/regions.geojson").then(regions => {
                // Add title as property to feature properties
                regions.features.forEach(region => {
                    region.properties.title = region.properties.LnNamn + " län";
                });
                return regions;
            });
        }

        static partiesMultiple(regionNames) {
            return Promise.all(regionNames.map(regionName => Data.Region.parties(regionName)))           
        }

        static parties(regionName) {
            if (regionName.charAt(regionName.length-1) == "s") {
                regionName = regionName.slice(0, regionName.length-1);
            }
            if (regionName == "Gotland") {
                return Data.Municipality.parties(regionName);
            }
            return d3.dsv(";", "./data/parties/party-result-region-" + regionName + ".csv").then(Data.Party.standardizeData);            
        }
    }

    static Municipality = class {
        static geoJson(regionName) {
            return d3.json("./data/geodata/" + regionName + ".geojson").then(municipalities => {
                // Add title as property to feature properties
                municipalities.features.forEach(municipality => {
                    municipality.properties.title = municipality.properties.KnNamn;
                    if (municipality.properties.KnNamn == "Malung") {
                        municipality.properties.KnNamn = "Malung-Sälen";
                    }
                });
                return municipalities;
            });
        }

        static partiesMultiple(municipalityNames) {
            return Promise.all(municipalityNames.map(municipalityName => Data.Municipality.parties(municipalityName)));
        }

        static parties(municipalityName) {
            return d3.dsv(";", "./data/parties/party-result-municipality-" + municipalityName + ".csv").then(Data.Party.standardizeData);
        }
    };

    static Party = class {
        /**
         * Example of the standardized format:
         * 
         * +------------------------------------+-----------+---------+------------------------------------+--------+
         * | name                               | shortName | color   | url                                | value  |
         * |------------------------------------+-----------+---------+------------------------------------+--------|
         * | Arbetarepartiet-Socialdemokraterna | S         | #EE2020 | https://www.socialdemokraterna.se/ | 28.512 |
         * +------------------------------------+-----------+---------+------------------------------------+--------+
         */
        static standardizeData(parties) {
            return parties
                .map(party => { return {
                    name: party.PARTIBETECKNING,
                    shortName: party.PARTIFÖRKORTNING,
                    color: party.color,
                    url: party.url,
                    value: Optional.of(party.result_2018).map(parseFloat).else(undefined)
                }});    
        }

        /**
         * All parties with value < 1.0 are put into "Others".
         */
        static aggreatePartiesBelowOnePercent(parties) {
            const filteredParties = parties
                .filter(party => party.value != "" && parseFloat(party.value) > 1.0)
                .map(party => {
                    if (party.color == "") {
                        party.color = "grey";
                        console.log("Not having color for: " + party.name);
                    }
                    return party;
                })
            filteredParties.push({
                name: "Others", 
                shortName: "Others", 
                color: "grey", 
                value: 100.0 - filteredParties.map(v => v.value).reduce((x,y) => x+y, 0)
            });
            return filteredParties;
        }

        /**
         * @returns a function "color" taking and index as parameter, follows same order as partyLists.
         * 
         * Given
         *   partyName = "Mitt Parti"
         *   partyLists = [
         *    [{name: "Mitt Parti", color: "red", value: 10.0}, ...], <-- Data for region 1
         *    [{name: "Mitt Parti", color: "red", value: 11.0}, ...], <-- Data for region 2
         *    [{name: "Mitt Parti", color: "red", value: 8.0}, ...], <-- Data for region 3
         *    [{name: "Mitt Parti", color: "red", value: 0.0}, ...], <-- Data for region 4
         *   ]
         * Then
         *   color is a function that returns a color between white and red
         *   region 2 has the highest value so color(1) returns red 
         *   region 4 has value zero so color(3) returns white 
         */
        static toGradientColor(partyLists, partyName) {
            const selectedPartyForEach = partyLists.map(partyList => {
                const selectedParty = partyList.filter(party => party.name == partyName)[0];
                return Optional.of(selectedParty).else({name: partyName, color: undefined, value: 0})
            }); 
            const resultForEach = selectedPartyForEach.map(v => v.value);
            const higestResultOfAll = resultForEach.reduce((x,y) => Math.max(x, y), 0);
            const colorForParty = Optional.of(selectedPartyForEach.filter(party => party.color))
                .map(partyList => {
                    if (partyList.length != 0) {
                        return partyList[0].color;
                    }
                    return null;
                })
                .else("grey");
    
            const color = d3.scaleLinear()
                .domain([0, higestResultOfAll])
                .range(["white", colorForParty])
    
            return (i) => color(resultForEach[i]);
        }
    };

}