import pandas as pd
import numpy as np


def read_parties_csv(parties_file_path):
    return pd.read_csv(
        parties_file_path,
        usecols=["VALTYP", "VALOMRÅDESKOD", "VALOMRÅDESNAMN", "PARTIBETECKNING", "PARTIFÖRKORTNING", "PARTIKOD"],
        sep=";",
        encoding="cp1252",
        index_col=False
    ).drop_duplicates()


def create_result_csv(area_name: str, parties: pd.DataFrame, result: pd.DataFrame, party_websites: pd.DataFrame):
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
    for index, (party_name, party_url) in party_websites.iterrows():
        parties.loc[parties['PARTIBETECKNING'] == party_name, 'url'] = party_url

    print("Parties in list {}".format(len(parties.index)))
    print("Parties with result {}".format(len(result_agg)))
    print("Not matched: {}".format(unmatched))

    save_file_path = "./output/party-result-{}.csv".format(area_name)
    parties.to_csv(save_file_path, sep=";", index=False)
    print("Finished {}".format(save_file_path))


def create_for_region(region_name: str, parties_region: pd.DataFrame, result_region: pd.DataFrame):
    pass


def main(
        parties_file_path: str,
        result_country_file_path: str,
        result_region_file_path: str,
        result_municipality_file_path: str,
        party_websites_file_path: str,
):
    parties_per_district = read_parties_csv(parties_file_path)
    party_websites = pd.read_csv(party_websites_file_path)

    # Country
    parties_country = parties_per_district[parties_per_district['VALTYP'] == 'RD'].copy()
    result_country = pd.read_excel(result_country_file_path, sheet_name="R antal", engine="openpyxl").fillna(0)
    create_result_csv("country", parties_country, result_country, party_websites)

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
            party_websites
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
            party_websites
        )

    # print(result_municipality.head())


if __name__ == '__main__':
    # Needs openpyxl for .xlsx files
    pd.set_option('display.max_columns', None)
    pd.set_option('display.max_rows', None)
    main(
        "../data-collected/deltagande-partier.csv",
        "../data-collected/2018_R_per_kommun.xlsx",
        "../data-collected/2018_L_per_kommun.xlsx",
        "../data-collected/2018_K_per_kommun.xlsx",
        "../data-collected/party-websites.csv",
    )
