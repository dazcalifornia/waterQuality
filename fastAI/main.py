from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector

from pydantic import BaseModel
import pandas as pd
import json
import pickle 


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

salinity_model = pickle.load(open('./models/salinity_model.pkl', 'rb'))
turbidity_model = pickle.load(open('./models/turbidity_model.pkl', 'rb'))
sea_temp_model = pickle.load(open('./models/sea_temp_model.pkl', 'rb'))
do_saturation_model = pickle.load(open('./models/do_saturation_model.pkl', 'rb'))
chlorophyll_model = pickle.load(open('./models/chlorophyll_model.pkl', 'rb'))

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


