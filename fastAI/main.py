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

# Read combined csv file
df = pd.read_csv('./data/corrective.csv', index_col='Datetime')

# Split dataframe into separate dataframes based on column names
salinity_df = df[['Salinity (PSU)']]
conductivity_df = df[['Conductivity (mS/cm)']]
ph_df = df[['pH']]
turbidity_df = df[['Turbidity (FTU)']]
sea_temp_df = df[['Sea temperature (°C)']]
do_saturation_df = df[['DO saturation (%)']]
chlorophyll_df = df[['Chlorophyll-a (ppb)']]

# Resample data to daily frequency
salinity_daily = salinity_df.resample('D').mean()
conductivity_daily = conductivity_df.resample('D').mean()
ph_daily = ph_df.resample('D').mean()
turbidity_daily = turbidity_df.resample('D').mean()
sea_temp_daily = sea_temp_df.resample('D').mean()
do_saturation_daily = do_saturation_df.resample('D').mean()
chlorophyll_daily = chlorophyll_df.resample('D').mean()

# Combine resampled data into a single dictionary
output_data = {
    'salinity': salinity_daily.to_dict('records'),
    'conductivity': conductivity_daily.to_dict('records'),
    'ph': ph_daily.to_dict('records'),
    'turbidity': turbidity_daily.to_dict('records'),
    'sea_temp': sea_temp_daily.to_dict('records'),
    'do_saturation': do_saturation_daily.to_dict('records'),
    'chlorophyll': chlorophyll_daily.to_dict('records')
}

# Define endpoint to return resampled data as JSON
@app.get('/resampled-data')
async def get_resampled_data():
    return JSONResponse(content=output_data)


@app.get('/data')
async def get_data():
    # Define the file names and columns for each CSV file
    files = [
        {'name': 'cholorophy.csv', 'columns': ['Datetime', 'Chlorophyll-a (ppb)']},
        {'name': 'conduct.csv', 'columns': ['Datetime', 'Conductivity (mS/cm)']},
        {'name': 'DoSturation.csv', 'columns': ['Datetime', 'DO saturation (%)']},
        {'name': 'salinity.csv', 'columns': ['Datetime', 'Salinity (PSU)']},
        {'name': 'seaTemp.csv', 'columns': ['Datetime', 'Sea temperature (°C)']},
        {'name': 'turbidity.csv', 'columns': ['Datetime', 'Turbidity (FTU)']},
    ]

    # Read the CSV files and combine them into a single DataFrame
    dfs = []
    for file in files:
        file_path = os.path.join('./data', file['name'])
        df = pd.read_csv(file_path, usecols=file['columns'])
        dfs.append(df)
    data_df = pd.concat(dfs, axis=1)

    # Convert the Datetime column to a datetime object and set it as the index
    data_df['Datetime'] = pd.to_datetime(data_df['Datetime'], format='%Y-%m-%d %H:%M:%S')
    data_df.set_index('Datetime', inplace=True)

    # Resample the data to daily frequency
    data_df_daily = data_df.resample('D').mean()

    # Convert the data to a JSON response
    output_data = data_df_daily.to_dict('index')
    return output_data

@app.get("/salinity")
async def get_salinity():
     # Load the csv file as a pandas dataframe
    salinity_df = pd.read_csv("salinity.csv")
    # Convert the date column to datetime format
    salinity_df['Datetime'] = pd.to_datetime(salinity_df['Datetime'])
    # Set the date column as the index
    salinity_df.set_index('Datetime', inplace=True)
    # Resample by day and take the mean value of each day
    salinity_daily = salinity_df.resample('D').mean()
    # Convert dataframe to JSON and return
    return JSONResponse(content=salinity_daily.to_json(orient="columns"))

@app.post('/predict')
async def predict(request: Request):
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

