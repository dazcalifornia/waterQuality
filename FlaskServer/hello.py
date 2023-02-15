from flask import Flask, render_template
import pandas as pd
import matplotlib.pyplot as plt

app = Flask(__name__)

@app.route('/')
def index():
    # read the data and set the index
    salinity = pd.read_csv('./Data/salinity.csv')
    salinity.set_index('Datetime', inplace=True)
    salinity.index = pd.to_datetime(salinity.index, format='%Y-%m-%d %H:%M:%S')

    # check if the index is ready for resampling
    if type(salinity.index) == pd.DatetimeIndex:
        print("The index is ready for resampling.")
    else:
        print("The index is not ready for resampling.")

    # resample the data
    monthly_data = salinity.resample("M").mean()
    daily_data = salinity.resample("D").interpolate()

    # plot the data
    plt.plot(monthly_data)
    plt.xlabel("Month-Year")
    plt.ylabel("Mean Value")
    plt.title("Data by Month for 1 Years")

    # save the plot to a file and return it
    figfile = BytesIO()
    plt.savefig(figfile, format='png')
    figfile.seek(0)
    figdata_png = base64.b64encode(figfile.getvalue()).decode('ascii')
    return render_template('plot.html', figdata_png=figdata_png)

if __name__ == '__main__':
    app.run(debug=True)
