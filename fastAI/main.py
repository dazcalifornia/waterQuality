from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
import decimal

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


def air_test(time_range):

    try:
        db = mysql.connector.connect(**db_config)
        query  = "SELECT * FROM `northbongkot`"
        df = pd.read_sql(query, con=db)
        db.close()
        
        df.set_index('Datetime', inplace=True)
        if time_range == 'month': 
            df = df.resample('M').mean()
            datetime_format = '%Y-%m-%d'
        elif time_range == 'week':
            df = df.resample('W').mean()
            datetime_format = '%Y-%m-%d'
        elif time_range == 'day':
            df = df.resample('D').mean()
            datetime_format = '%Y-%m-%d'
        elif time_range == '24hours':
            df = df.resample('H').mean()
            df = df.tail(24)
            datetime_format = '%H:%M:%S'
        else:
            raise HTTPException(status_code=400, detail="Invalid time range")
        df.reset_index(inplace=True)
        df['Datetime'] = df['Datetime'].dt.strftime(datetime_format)
        df = df.to_dict(orient='list')
        return df
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def fetch_data(time_range):
    # Connect to the MySQL database
    db = mysql.connector.connect(**db_config)

    # Get the latest datetime from the table
    latest_datetime_query = "SELECT MAX(Datetime) FROM northBongkot"
    cursor = db.cursor()
    cursor.execute(latest_datetime_query)
    latest_datetime = cursor.fetchone()[0]

    # Calculate the datetime range based on the requested time_range
    if time_range == "":
        start_time = latest_datetime.replace(month=1, day=1)
    elif time_range == "month":
        start_time = latest_datetime.replace(day=1)
    elif time_range == "24hours":
        start_time = latest_datetime - timedelta(days=1)
    elif time_range == "week":
        start_time = latest_datetime - timedelta(weeks=1)
    else:
        raise HTTPException(status_code=400, detail="Invalid time range")

    end_time = latest_datetime

    # Create an SQL query to fetch data within the specified range
    query = (
        "SELECT Datetime, airTemp, relativehumid, atm, windSpeed, windDirect "
        "FROM northBongkot "
        "WHERE Datetime BETWEEN %s AND %s"
    )

    cursor = db.cursor(dictionary=True)
    cursor.execute(query, (start_time, end_time))
    result = cursor.fetchall()

    # Convert Decimal values to floats and Datetime to strings
    for row in result:
        for key, value in row.items():
            if isinstance(value, decimal.Decimal):
                row[key] = float(value)
            elif key == 'Datetime':
                row[key] = value.strftime('%Y-%m-%d %H:%M:%S')

    cursor.close()
    db.close()

     # Create a DataFrame from the fetched data
    df = pd.DataFrame(result)

    # Convert Datetime column to datetime type
    df['Datetime'] = pd.to_datetime(df['Datetime'])

    # Set Datetime column as index
    df.set_index('Datetime', inplace=True)

   # Resample the data to calculate mean per hour
    mean_per_hour = df.resample('H').mean()

    # Convert the resampled data to a dictionary
    mean_per_hour_dict = mean_per_hour.to_dict(orient='list')  # Use 'list' orientation

    # Convert Timestamp index to time format
    mean_per_hour_dict['Datetime'] = mean_per_hour.index.strftime('%H:%M:%S').tolist()

    return mean_per_hour_dict

@app.get('/forecast1month')
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

    # Calculate the forecast range for the next month
    end_date = df.index.max() + pd.DateOffset(months=1)
    forecast_range = pd.date_range(start=df.index.max(), end=end_date, freq='D')

    # Generate predictions for each variable for the next month
    salinity_pred = salinity_model.forecast(steps=len(forecast_range)).tolist()
    turbidity_pred = turbidity_model.forecast(steps=len(forecast_range)).tolist()
    sea_temp_pred = sea_temp_model.forecast(steps=len(forecast_range)).tolist()
    do_saturation_pred = do_saturation_model.forecast(steps=len(forecast_range)).tolist()
    chlorophyll_pred = chlorophyll_model.forecast(steps=len(forecast_range)).tolist()

    # Create a list of forecasted dates for the next month
    forecast_dates = forecast_range.strftime('%Y-%m-%d').tolist()

    # Combine predicted values with forecasted dates into a list of WaterData objects
    forecast_data = []
    for i in range(len(forecast_range)):
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

@app.get("/north_bongkot_data")
def get_north_bongkot_data_by_time_range(time_range: str):
    try:
        data = air_test(time_range)
        if not data["Datetime"]:
            return {"message": "No data available for the requested time range"}
        return JSONResponse(content=data)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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


@app.get("/noti2")
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
    notification = {}

    for column in df.columns[1:]:
        latest_value = latest_row[column]
        previous_value = previous_row[column]
        percent_diff = abs(latest_value - previous_value) / previous_value * 100

        status = ""
        if 1 <= percent_diff <= 5:
            status = "No Notification"
        elif 5 < percent_diff < 10:
            if latest_value > previous_value:
                status = "Low Moderated"
            else:
                status = "Low Danger"
        elif percent_diff >= 10:
            if latest_value > previous_value:
                status = "High Moderated"
            else:
                status = "High Danger"

        notification[column] = {
            'latest': latest_value,
            'previous': previous_value,
            'percent_diff': percent_diff,
            'status': status
        }

    return JSONResponse(content=notification)

@app.get("/db3")
async def get_db(time_range: str):
    try:
        db = mysql.connector.connect(**db_config)
        query = "SELECT * FROM `WaterData`"
        df = pd.read_sql(query, con=db)
        db.close()

        # Convert to datetime
        df['Datetime'] = pd.to_datetime(df['Datetime'])

        # Set Datetime column as the index
        df.set_index('Datetime', inplace=True)

        if time_range == '24hours':
            df_range = df.tail(24)  # Retrieve the last 24 rows
            datetime_format = '%H:%M:%S'  # Format as time only
        elif time_range == 'week':
            start_time = df.index.max() - pd.DateOffset(weeks=1) + pd.Timedelta(days=1)  # Start from the beginning of the week
            end_time = df.index.max()  # End at the latest available date
            df_range = df[(df.index >= start_time) & (df.index <= end_time)]
            df_range = df_range.resample('D').mean()  # Resample to daily frequency
            datetime_format = '%Y-%m-%d'  # Format as date only
        elif time_range == 'month':
            start_time = df.index.max() - pd.DateOffset(months=1) + pd.Timedelta(days=1)  # Start from the beginning of the month
            end_time = df.index.max()  # End at the latest available date
            df_range = df[(df.index >= start_time) & (df.index <= end_time)]
            df_range = df_range.resample('D').mean()  # Resample to daily frequency
            datetime_format = '%Y-%m-%d'  # Format as date only
        else:
            df_range = df
            datetime_format = '%Y-%m-%d %H:%M:%S'  # Format as full date and time

        data = {
            'Datetime': df_range.index.strftime(datetime_format).tolist(),
            'Salinity': df_range['Salinity_PSU'].tolist(),
            'Conductivity': df_range['Conductivity_mScm'].tolist(),
            'Turbidity': df_range['Turbidity_FTU'].tolist(),
            'SeaTemp': df_range['Sea_temperature_°C'].tolist(),
            'DO': df_range['DO_saturation_'].tolist(),
            'chlorophyll': df_range['Chlorophylla_ppb'].tolist()
        }

        return JSONResponse(content=data)
    except Exception as e:
        return JSONResponse(content={"message": str(e)}, status_code=500)


@app.get("/device")
async def get_details():
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Get table names
        cursor.execute("SHOW TABLES")
        tables = [table[0] for table in cursor.fetchall()]

        table_data = {}
        for table in tables:
            # Get column names for each table
            cursor.execute(f"DESCRIBE {table}")
            columns = [column[0] for column in cursor.fetchall()]
            
            # Exclude columns with data (customize this list as needed)
            excluded_columns = ["id", "created_at", "updated_at"]
            data_columns = [col for col in columns if col not in excluded_columns]
            
            table_data[table] = data_columns

        cursor.close()
        connection.close()

        return JSONResponse(content=table_data)
    except mysql.connector.Error as err:
        return JSONResponse(content={"error": f"MySQL Error: {err}"}, status_code=500)

