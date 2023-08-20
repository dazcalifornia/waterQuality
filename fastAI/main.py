from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector

from pytz import timezone
from fastapi import Query
from datetime import datetime, timedelta, timezone

from pydantic import BaseModel
import pandas as pd
import json
import pickle 
from pandas.tseries.offsets import DateOffset


app = FastAPI()

# Allow CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
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

salinity_model = pickle.load(open('./models/salinity_model.pkl', 'rb'))
turbidity_model = pickle.load(open('./models/turbidity_model.pkl', 'rb'))
sea_temp_model = pickle.load(open('./models/sea_temp_model.pkl', 'rb'))
do_saturation_model = pickle.load(open('./models/do_saturation_model.pkl', 'rb'))
chlorophyll_model = pickle.load(open('./models/chlorophyll_model.pkl', 'rb'))


class WaterData(BaseModel):
    Datetime: str
    Salinity: float
    Turbidity: float
    SeaTemp: float
    DOSaturation: float
    Chlorophyll: float


@app.get('/north_bongkot_data')
async def get_north_bongkot_data():
    # Connect to the MySQL database
    db = mysql.connector.connect(**db_config)

    # Query to fetch data from the northBongkot table
    query = "SELECT * FROM northBongkot"

    # Read data into a DataFrame
    df = pd.read_sql(query, con=db)

    # Close the database connection
    db.close()

    # Convert datetime string to datetime object
    df['Datetime'] = pd.to_datetime(df['Datetime'])

    # Convert Datetime column to strings
    df['Datetime'] = df['Datetime'].dt.strftime('%Y-%m-%d %H:%M:%S')

    # Return data as JSON response
    return JSONResponse(content=df.to_dict(orient='records'))

@app.get('/forecast')
async def forecast():
    db = mysql.connector.connect(**db_config)
    query = "SELECT * FROM `WaterData`"
    df = pd.read_sql(query, con=db)
    db.close()
    
    # Convert datetime string to datetime object
    df['Datetime'] = pd.to_datetime(df['Datetime'].str.replace(':', ''), format='%Y-%m-%d %H%M%S%z')

    # Set Datetime as index
    df.set_index('Datetime', inplace=True)

    # Clean the input data
    df = df.dropna()

    # Generate predictions for each variable
    salinity_pred = salinity_model.forecast(steps=7).tolist()
    turbidity_pred = turbidity_model.forecast(steps=7).tolist()
    sea_temp_pred = sea_temp_model.forecast(steps=7).tolist()
    do_saturation_pred = do_saturation_model.forecast(steps=7).tolist()
    chlorophyll_pred = chlorophyll_model.forecast(steps=7).tolist()

    # Create a list of forecasted dates for the next 7 days
    forecast_dates = pd.date_range(start=df.index[-1] + pd.DateOffset(days=1), periods=7, freq='D').strftime('%Y-%m-%d').tolist()

    # Combine predicted values with forecasted dates into a list of WaterData objects
    forecast_data = []
    for i in range(7):
        data = WaterData(
            Datetime=forecast_dates[i],
            Salinity=salinity_pred[i],
            Turbidity=turbidity_pred[i],
            SeaTemp=sea_temp_pred[i],
            DOSaturation=do_saturation_pred[i],
            Chlorophyll=chlorophyll_pred[i]
        )
        forecast_data.append(data)

    # Return forecasted values as JSON response
    return JSONResponse(content=[data.dict() for data in forecast_data])


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



@app.get("/noti")
async def get_notification():
    db = mysql.connector.connect(**db_config)
    query = "SELECT * FROM `WaterData` ORDER BY `Datetime` DESC LIMIT 2"  # Retrieve the latest 2 rows
    df = pd.read_sql(query, con=db)
    db.close()
    
    if len(df) < 2:
        return JSONResponse(content={'error': 'Insufficient data'}, status_code=400)
    
    latest_row = df.iloc[0]
    previous_row = df.iloc[1]
    
    # Calculate the absolute difference as a percentage
    notification = {
        'Salinity': {
            'latest': latest_row['Salinity_PSU'],
            'previous': previous_row['Salinity_PSU'],
            'percent_diff': abs(latest_row['Salinity_PSU'] - previous_row['Salinity_PSU']) / previous_row['Salinity_PSU'] * 100
        },
        'Conductivity': {
            'latest': latest_row['Conductivity_mScm'],
            'previous': previous_row['Conductivity_mScm'],
            'percent_diff': abs(latest_row['Conductivity_mScm'] - previous_row['Conductivity_mScm']) / previous_row['Conductivity_mScm'] * 100
        },
        'Turbidity': {
            'latest': latest_row['Turbidity_FTU'],
            'previous': previous_row['Turbidity_FTU'],
            'percent_diff': abs(latest_row['Turbidity_FTU'] - previous_row['Turbidity_FTU']) / previous_row['Turbidity_FTU'] * 100
        },
        'SeaTemp': {
            'latest': latest_row['Sea_temperature_°C'],
            'previous': previous_row['Sea_temperature_°C'],
            'percent_diff': abs(latest_row['Sea_temperature_°C'] - previous_row['Sea_temperature_°C']) / previous_row['Sea_temperature_°C'] * 100
        },
        'DO': {
            'latest': latest_row['DO_saturation_'],
            'previous': previous_row['DO_saturation_'],
            'percent_diff': abs(latest_row['DO_saturation_'] - previous_row['DO_saturation_']) / previous_row['DO_saturation_'] * 100
        },
        'chlorophyll': {
            'latest': latest_row['Chlorophylla_ppb'],
            'previous': previous_row['Chlorophylla_ppb'],
            'percent_diff': abs(latest_row['Chlorophylla_ppb'] - previous_row['Chlorophylla_ppb']) / previous_row['Chlorophylla_ppb'] * 100
        }
    }

    return JSONResponse(content=notification)


@app.get("/db2")
async def get_db(time_range: str = '24hours'):
    db = mysql.connector.connect(**db_config)
    query = "SELECT * FROM `WaterData`"
    df = pd.read_sql(query, con=db)
    db.close()

    # convert to datetime
    df['Datetime'] = pd.to_datetime(df['Datetime'])

    # Set Datetime column as the index
    df.set_index('Datetime', inplace=True)

    if time_range == '24hours':
        df_range = df.tail(24)  # Retrieve the last 24 rows
        datetime_format = '%H:%M:%S'  # Format as time only
    elif time_range == 'week':
        start_time = df.index.max() - DateOffset(weeks=1) + timedelta(days=1)  # Start from the beginning of the week
        end_time = df.index.max()  # End at the latest available date
        df_range = df[(df.index >= start_time) & (df.index <= end_time)]
        df_range = df_range.resample('D').mean()  # Resample to daily frequency
        datetime_format = '%Y-%m-%d'  # Format as date only
    elif time_range == 'month':
        start_time = df.index.max() - DateOffset(months=1) + timedelta(days=1)  # Start from the beginning of the month
        end_time = df.index.max()  # End at the latest available date
        df_range = df[(df.index >= start_time) & (df.index <= end_time)]
        df_range = df_range.resample('D').mean()  # Resample to daily frequency
        datetime_format = '%Y-%m-%d'  # Format as date only
    else:
        df_range = df
        datetime_format = '%Y-%m-%d %H:%M:%S'  # Format as full date and time

    data = {}
    data['Datetime'] = df_range.index.strftime(datetime_format).tolist()
    data['Salinity'] = df_range['Salinity_PSU'].tolist()
    data['Conductivity'] = df_range['Conductivity_mScm'].tolist()
    data['Turbidity'] = df_range['Turbidity_FTU'].tolist()
    data['SeaTemp'] = df_range['Sea_temperature_°C'].tolist()
    data['DO'] = df_range['DO_saturation_'].tolist()
    data['chlorophyll'] = df_range['Chlorophylla_ppb'].tolist()

    return JSONResponse(content=data)

@app.get('/selective_data')
async def selective_data(start_datetime: str, end_datetime: str):
    # Connect to the MySQL database
    db = mysql.connector.connect(**db_config)

    # Get the data for each variable within the datetime range
    query = "SELECT Datetime, Salinity_PSU FROM WaterData WHERE Datetime >= '{}' AND Datetime <= '{}'"
    salinity_query = query.format(start_datetime, end_datetime)
    salinity_df = pd.read_sql(salinity_query, con=db)
    salinity_df.set_index('Datetime', inplace=True)

    query = "SELECT Datetime, Turbidity_FTU FROM WaterData WHERE Datetime >= '{}' AND Datetime <= '{}'"
    turbidity_query = query.format(start_datetime, end_datetime)
    turbidity_df = pd.read_sql(turbidity_query, con=db)
    turbidity_df.set_index('Datetime', inplace=True)

    query = "SELECT Datetime, Sea_temperature_°C FROM WaterData WHERE Datetime >= '{}' AND Datetime <= '{}'"
    sea_temp_query = query.format(start_datetime, end_datetime)
    sea_temp_df = pd.read_sql(sea_temp_query, con=db)
    sea_temp_df.set_index('Datetime', inplace=True)

    query = "SELECT Datetime, DO_saturation_ FROM WaterData WHERE Datetime >= '{}' AND Datetime <= '{}'"
    do_saturation_query = query.format(start_datetime, end_datetime)
    do_saturation_df = pd.read_sql(do_saturation_query, con=db)
    do_saturation_df.set_index('Datetime', inplace=True)

    query = "SELECT Datetime, Chlorophylla_ppb FROM WaterData WHERE Datetime >= '{}' AND Datetime <= '{}'"
    chlorophyll_query = query.format(start_datetime, end_datetime)
    chlorophyll_df = pd.read_sql(chlorophyll_query, con=db)
    chlorophyll_df.set_index('Datetime', inplace=True)

    # Combine the dataframes into a single dictionary
    output_data = {
        'salinity': salinity_df.to_dict(),
        'turbidity': turbidity_df.to_dict(),
        'sea_temp': sea_temp_df.to_dict(),
        'do_saturation': do_saturation_df.to_dict(),
        'chlorophyll': chlorophyll_df.to_dict()
    }

    # Return data as JSON response
    return JSONResponse(content=output_data)
