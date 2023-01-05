class Data {

    static Country = class {
        static parties() {
            return d3.dsv(";", "./data/parties/party-result-country.csv");
        }
    }

    static Region = class {
        static geoJson() {
            return d3.json("./data/geodata/regions.geojson").then(function(regions) {
                // Add title as property to feature properties
                regions.features.forEach(function(region) {
                    region.properties.title = region.properties.LnNamn + " län";
                });
                return regions;
            });
        }

        static parties(regionName) {
            if (regionName.charAt(regionName.length-1) == "s") {
                regionName = regionName.slice(0, regionName.length-1);
            }
            return d3.dsv(";", "./data/parties/party-result-region-" + regionName + ".csv");            
        }
    }

    static Municipality = class {
        static geoJson(regionName) {
            return d3.json("./data/geodata/" + regionName + ".geojson").then(function(municipalities) {
                // Add title as property to feature properties
                municipalities.features.forEach(function(municipality) {
                    municipality.properties.title = municipality.properties.KnNamn;
                    if (municipality.properties.KnNamn == "Malung") {
                        municipality.properties.KnNamn = "Malung-Sälen";
                    }
                });
                return municipalities;
            });
        }

        static parties(municipalityName) {
            return d3.dsv(";", "./data/parties/party-result-municipality-" + municipalityName + ".csv");
        }
    }
}