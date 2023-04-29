from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector

from pydantic import BaseModel
import pandas as pd
import json


app = FastAPI()

# Allow CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db_config = {
        'host': 'localhost',
        'user': 'root',
        'password': '',
        'database': 'dashboard'
    }



@app.get("/db")
async def get_db():
    db = mysql.connector.connect(**db_config)
    query = "SELECT * FROM `WaterData`"
    df = pd.read_sql(query, con=db)
    db.close()
    
    # convert to datetime
    df['Datetime'] = pd.to_datetime(df['Datetime'])
    
    # set index to Datetime
    df.set_index('Datetime', inplace=True)
    
    # resample to monthly frequency
    df_monthly = df.resample('M').mean()
    
    data = {}
    data['Datetime'] = df_monthly.index.strftime('%Y-%m-%d').tolist()
    data['Salinity'] = df_monthly['Salinity_PSU'].tolist()
    data['Conductivity'] = df_monthly['Conductivity_mScm'].tolist()
    data['Turbidity'] = df_monthly['Turbidity_FTU'].tolist()
    data['SeaTemp'] = df_monthly['Sea_temperature_°C'].tolist()
    data['DO'] = df_monthly['DO_saturation_'].tolist()
    data['chlorophyll'] = df_monthly['Chlorophylla_ppb'].tolist()


    return JSONResponse(content=data)



@app.get("/salinity")
async def get_salinity():
    # Load the csv file as a pandas dataframe
    salinity_df = pd.read_csv("./data/salinity.csv")
    # Convert the date column to datetime format
    salinity_df['Datetime'] = pd.to_datetime(salinity_df['Datetime'])
    # Set the date column as the index
    salinity_df.set_index('Datetime', inplace=True)
    # Resample by day and take the mean value of each day
    salinity_daily = salinity_df.resample('D').mean()

    # Get the data type of the index column
    index_dtype = salinity_daily.index.dtype.name

    # Convert dataframe to JSON
    salinity_daily_json = salinity_daily.reset_index().to_json(orient="records")
    # Parse the JSON into a list of dictionaries
    salinity_daily_list = json.loads(salinity_daily_json)
    # Create a list of datetime values and salinity values
    datetime_list = [row['Datetime'] for row in salinity_daily_list]
    salinity_list = [row['Salinity (PSU)'] for row in salinity_daily_list]
    # Return a dictionary containing the datetime and salinity lists
    return {'datetime': datetime_list, 'salinity': salinity_list, 'index_dtype': index_dtype}


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

