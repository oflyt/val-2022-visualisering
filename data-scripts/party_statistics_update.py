import os
import shutil

import pandas as pd
import requests

import party_statistics_process


def main() -> None:
    # 2022 results
    # https://www.val.se/download/18.14c1f613181ed0043d58dd4/1667208175978/Roster-per-distrikt-slutligt-antal-roster-inklusive-totalt-valdeltagande-riksdagsvalet-2022.xlsx
    # https://www.val.se/download/18.14c1f613181ed0043d58dd6/1667210465621/roster-per-distrikt-slutligt-antal-roster-inklusive-totalt-valdeltagande-regionval-2022.xlsx
    # https://www.val.se/download/18.14c1f613181ed0043d58dd8/1667210741987/roster-per-distrikt-slutligt-antal-roster-inklusive-totalt-valdeltagande-kommunval-2022.xlsx

    # print("Downloading...")
    # download_file("https://www.val.se/download/18.75995f7b17f5a986a4eebb/1662088208176/deltagande-partier.csv", "../data-collected/deltagande-partier.csv")
    # download_file("https://historik.val.se/val/val2018/statistik/2018_R_per_kommun.xlsx", "../data-collected/2018_R_per_kommun.xlsx")
    # download_file("https://historik.val.se/val/val2018/statistik/2018_L_per_kommun.xlsx", "../data-collected/2018_L_per_kommun.xlsx")
    # download_file("https://historik.val.se/val/val2018/statistik/2018_K_per_kommun.xlsx", "../data-collected/2018_K_per_kommun.xlsx")
    
    print("Processing...")
    party_statistics_process.main(
        "../data-collected/deltagande-partier.csv",
        "../data-collected/2018_R_per_kommun.xlsx",
        "../data-collected/2018_L_per_kommun.xlsx",
        "../data-collected/2018_K_per_kommun.xlsx",
        "../data-collected/party-code-websites.csv",
        "../data-collected/party-code-colors.csv",
    )

    print("Moving...")
    move_files("output/party-results/", "../website/data/parties/")


def download_file(download_url: str, store_path: str) -> None:
    downloaded_file = requests.get(download_url)
    with open(store_path, 'wb') as file_to_write_to:
        file_to_write_to.write(downloaded_file.content)


def move_files(source_folder: str, destination_folder: str) -> None:
    # fetch all files
    for file_name in os.listdir(source_folder):
        # construct full file path
        source = source_folder + file_name
        destination = destination_folder + file_name
        # Remove old file
        if os.path.isfile(destination):
            os.remove(destination)
        # move only files
        if os.path.isfile(source):
            shutil.move(source, destination)
            print('Moved:', file_name)


if __name__ == '__main__':
    # Needs openpyxl for .xlsx files
    pd.set_option('display.max_columns', None)
    pd.set_option('display.max_rows', None)
    main()
