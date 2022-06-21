import os

import geopandas as gpd
import pandas as pd


def main(regions_file_path: str, municipalities_file_path: str) -> None:
    os.makedirs('./output/kommuner', exist_ok=True)

    data_reg = gpd.read_file(regions_file_path)
    print(data_reg.head())
    print(len(data_reg.index))
    data_reg.to_file('./output/kommuner/lan.geojson', driver="GeoJSON", encoding='utf-8')

    data_mun = gpd.read_file(municipalities_file_path)
    data_mun["LnKod"] = data_mun["KnKod"].apply(lambda kn_kod: kn_kod[:2])
    data_mun["LnNamn"] = data_mun["LnKod"].apply(lambda ln_kod: data_reg.loc[data_reg['LnKod'] == ln_kod, 'LnNamn'].iloc[0])
    print(data_mun.head())
    print(len(data_mun.index))
    for index, lan_namn in data_reg['LnNamn'].items():
        data_mun_reg = data_mun[data_mun['LnNamn'] == lan_namn]
        data_mun_reg.to_file('./output/kommuner/{}.geojson'.format(lan_namn), driver="GeoJSON", encoding='utf-8')


if __name__ == '__main__':
    pd.set_option('display.max_columns', None)
    main(
        "../data-collected/sverige-geodata/LanSweref99TM/Lan_Sweref99TM_region.shp",
        "../data-collected/sverige-geodata/KommunSweref99TM/Kommun_Sweref99TM_region.shp"
    )
