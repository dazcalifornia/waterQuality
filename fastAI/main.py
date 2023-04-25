from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pandas as pd
import pickle
import os

app = FastAPI()

# Load saved models
salinity_model = pickle.load(open('./models/salinity_model.pkl', 'rb'))
turbidity_model = pickle.load(open('./models/turbidity_model.pkl', 'rb'))
sea_temp_model = pickle.load(open('./models/sea_temp_model.pkl', 'rb'))
do_saturation_model = pickle.load(open('./models/do_saturation_model.pkl', 'rb'))
chlorophyll_model = pickle.load(open('./models/chlorophyll_model.pkl', 'rb'))

# Define input data schema
class InputData(BaseModel):
    Datetime: str
    Salinity: float
    Conductivity: float
    pH: float
    Turbidity: float
    Sea_temperature: float
    DO_saturation: float
    Chlorophyll: float




@app.get("/data/")
async def read_csv_files():
    folder_path = "./data"
    csv_files = [f for f in os.listdir(folder_path) if f.endswith('.csv')]
    df = pd.concat((pd.read_csv(os.path.join(folder_path, f)) for f in csv_files))
    data = df.to_dict('records')
    return JSONResponse(content=data)


@app.post('/predict')
async def predict(request: Request, file: UploadFile = File(...)):
    # Read input file
    input_df = pd.read_csv(file.file)

    # Convert datetime string to datetime object
    input_df['Datetime'] = pd.to_datetime(input_df['Datetime'], format='%Y-%m-%d %H:%M:%S')

    # Set Datetime as index
    input_df.set_index('Datetime', inplace=True)

    # Clean the input data
    input_df = input_df.dropna()

    # Generate predictions for each variable
    salinity_pred = salinity_model.forecast(steps=7).tolist()
    turbidity_pred = turbidity_model.forecast(steps=7).tolist()
    sea_temp_pred = sea_temp_model.forecast(steps=7).tolist()
    do_saturation_pred = do_saturation_model.forecast(steps=7).tolist()
    chlorophyll_pred = chlorophyll_model.forecast(steps=7).tolist()

    # Combine predicted values into a single dictionary
    output_data = {
        'salinity': salinity_pred,
        'turbidity': turbidity_pred,
        'sea_temp': sea_temp_pred,
        'do_saturation': do_saturation_pred,
        'chlorophyll': chlorophyll_pred
    }

    # Return predicted values as JSON response
    return JSONResponse(content=output_data)

