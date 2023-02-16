from flask import Flask, request, jsonify, render_template
import pandas as pd 
import matplotlib.pyplot as plt
from matplotlib.figure import Figure
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas 
import base64
from io import BytesIO

app = Flask(__name__)



@app.route("/")
def plot():
    salinity = pd.read_csv('./Data/salinity.csv')
    salinity.set_index('Datetime', inplace=True)
    salinity.index = pd.to_datetime(salinity.index, format='%Y-%m-%d %H:%M:%S')
    monthly_data = salinity.resample("M").mean()
    plt.plot(monthly_data)
    plt.xlabel("Month-Year")
    plt.ylabel("Mean Value")
    plt.title("Data by Month for 1 Years")
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode('utf8')
    return render_template('plot.html', plot_url=plot_url)

@app.route("/test")
def hello():
    # Generate the figure **without using pyplot**.
    fig = Figure()
    ax = fig.subplots()
    ax.plot([1, 2])
    # Save it to a temporary buffer.
    buf = BytesIO()
    fig.savefig(buf, format="png")
    # Embed the result in the html output.
    data = base64.b64encode(buf.getbuffer()).decode("ascii")
    return f"<img src='data:image/png;base64,{data}'/>"


@app.route('/salinity.png', methods=['GET','POST','DELETE'])
def plot_png():
    fig = create_figure()
    output = io.BytesIO()
    FigureCanvas(fig).print_png(output)
    return Response(output.getvalue(), mimetype='image/png')
def create_figure():
    fig = Figure()
    axis = fig.add_subplot(1,1,1)
    xs = range(100)
    ys = [random.randint(1,50) for x in xs]
    axis.plot(xs,ys)

    return fig

if __name__ == '__main__':
    app.run(debug=True)

