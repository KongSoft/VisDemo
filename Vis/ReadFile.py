import csv
import numpy as np
def ReadCSVFile(file):
    with open (file) as csv_file:
        data_file = np.loadtxt(file, str, delimiter=",")
        feature = data_file[0]
        data = data_file[1:]
        return feature, data


if __name__ == '__main__':
    ReadCSVFile( "data2.csv")