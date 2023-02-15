from flask import Flask, request, jsonify, render_template
import pandas as pd 
import matplotlib.figure as Figure 
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas 


app = Flask(__name__)

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

