import pandas as pd
import numpy as np


def read_parties_csv(parties_file_path):
    return pd.read_csv(
        parties_file_path,
        usecols=["VALTYP", "VALOMRÅDESKOD", "VALOMRÅDESNAMN", "PARTIBETECKNING", "PARTIFÖRKORTNING", "PARTIKOD"],
        sep=";",
        encoding="utf-8",  # "cp1252",
        index_col=False
    ).drop_duplicates()


def create_result_csv(area_name: str, parties: pd.DataFrame, result: pd.DataFrame, party_websites: pd.DataFrame, party_colors: pd.DataFrame):
    # Clean out result columns
    result.drop(
        [
            'LÄNSKOD', 'KOMMUNKOD', 'LÄNSNAMN', 'KOMMUNNAMN',  # Don't care about this granularity
            'OGEJ', 'BLANK', 'OG',  # Not counted votes
            'RÖSTER GILTIGA', 'RÖSTANDE', 'RÖSTBERÄTTIGADE', 'VALDELTAGANDE'  # Unnecessary statistics
        ],
        axis=1,
        inplace=True
    )

    # Aggregate
    result_agg = result.agg("sum", axis=0)

    # To percentage
    total_votes = result_agg.sum()
    result_agg = result_agg.div(total_votes).multiply(100)

    # Join result with parties list
    unmatched = []
    for party_id, percentage in result_agg.items():
        join_col = 'PARTIKOD' if str(party_id).isnumeric() else 'PARTIFÖRKORTNING'
        matched_party = parties[parties[join_col] == party_id]
        parties.loc[parties[join_col] == party_id, 'result_2018'] = percentage
        if matched_party.empty:
            unmatched.append(party_id)

    # Join party websites with parties list
    for index, (party_name, party_code, party_url, comment) in party_websites.iterrows():
        parties.loc[parties['PARTIKOD'] == party_code, 'url'] = party_url
    
    for index, (party_name, party_code, party_color, comment) in party_colors.iterrows():
        parties.loc[parties['PARTIKOD'] == party_code, 'color'] = party_color

    print("Parties in list {}".format(len(parties.index)))
    print("Parties with result {}".format(len(result_agg)))
    print("Not matched: {}".format(unmatched))

    save_file_path = "./output/party-results/party-result-{}.csv".format(area_name)
    parties.to_csv(save_file_path, sep=";", index=False)
    print("Finished {}".format(save_file_path))


def main(
        parties_file_path: str,
        result_country_file_path: str,
        result_region_file_path: str,
        result_municipality_file_path: str,
        party_websites_file_path: str,
        party_colors_file_path: str,
):
    parties_per_district = read_parties_csv(parties_file_path)
    party_websites = pd.read_csv(party_websites_file_path, sep=";")
    party_colors = pd.read_csv(party_colors_file_path, sep=";")

    # print_parties_without_url(parties_per_district, party_websites)

    # Country
    parties_country = parties_per_district[parties_per_district['VALTYP'] == 'RD'].copy()
    result_country = pd.read_excel(result_country_file_path, sheet_name="R antal", engine="openpyxl").fillna(0)
    create_result_csv("country", parties_country, result_country, party_websites, party_colors)

    # Region
    parties_regions = parties_per_district[parties_per_district['VALTYP'] == 'RF'].copy()
    result_regions = pd.read_excel(result_region_file_path, sheet_name="L antal", engine="openpyxl").fillna(0)
    for region_name in parties_regions['VALOMRÅDESNAMN'].unique():
        parties_current_region = parties_regions[parties_regions['VALOMRÅDESNAMN'] == region_name].copy()
        result_regions['LÄNSNAMN'] = result_regions['LÄNSNAMN'].apply(
            lambda name: name.replace("s län", "").replace(" län", "")
        )
        result_current_region = result_regions[result_regions['LÄNSNAMN'] == region_name].copy()
        create_result_csv(
            "region-{}".format(region_name),
            parties_current_region,
            result_current_region,
            party_websites,
            party_colors
        )

    # Municipality
    parties_municipality = parties_per_district[parties_per_district['VALTYP'] == 'KF'].copy()
    result_municipality = pd.read_excel(result_municipality_file_path, sheet_name="K antal", engine="openpyxl").fillna(0)
    for municipality_name in parties_municipality['VALOMRÅDESNAMN'].unique():
        parties_current_municipality = parties_municipality[parties_municipality['VALOMRÅDESNAMN'] == municipality_name].copy()
        result_current_municipality = result_municipality[result_municipality['KOMMUNNAMN'] == municipality_name].copy()
        create_result_csv(
            "municipality-{}".format(municipality_name),
            parties_current_municipality,
            result_current_municipality,
            party_websites,
            party_colors
        )


def print_parties_without_url(parties_per_district, party_websites):
    parties_per_district[['PARTIBETECKNING', 'PARTIKOD']].drop_duplicates().to_csv("./output/parties-without-urls", sep=";", index=False)
    print(sorted(
        set(parties_per_district['PARTIBETECKNING'].unique())
            .difference(set(party_websites['party'].unique()))
    ))


if __name__ == '__main__':
    # Needs openpyxl for .xlsx files
    pd.set_option('display.max_columns', None)
    pd.set_option('display.max_rows', None)
    main(
        "../data-collected/deltagande-partier.csv",
        "../data-collected/2018_R_per_kommun.xlsx",
        "../data-collected/2018_L_per_kommun.xlsx",
        "../data-collected/2018_K_per_kommun.xlsx",
        "../data-collected/party-code-websites.csv",
        "../data-collected/party-code-colors.csv",
    )
