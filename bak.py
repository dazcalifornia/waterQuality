queryData = "SELECT * FROM northbongkot"
    df = pd.read_sql(queryData, con=db)
    db.close()
    print()

    df.set_index('Datetime', inplace=True)


 
    # Calculate the datetime range based on the requested time_range
    if time_range == "":
        start_time = latest_datetime.replace(month=1, day=1)
    elif time_range == "month":
        start_time = latest_datetime.replace(month=6)
    elif time_range == "24hours":
        start_time = latest_datetime - timedelta(days=1)
    elif time_range == "week":
        start_time = df.index.max() - pd.DateOffset(weeks=1) + pd.Timedelta(days=1)  # Start from the beginning of the week
        end_time = df.index.max()  # End at the latest available date
        df_range = df[(df.index >= start_time) & (df.index <= end_time)]
        df_range = df_range.resample('D').mean()  # Resample to daily frequency
        datetime_format = '%Y-%m-%d'  # Format as date only
    elif time_range == "monthV2":
        start_time = df.index.max() - pd.DateOffset(months=1) + pd.DateOffset(days=1)
        end_time = df.index.max()
        df_range = df.loc[(df.index >= start_time) & (df.index <= end_time)]
        df_range = df_range.resample('D').mean()
        datetime_format = '%Y-%m-%d'

    
    else:
        raise HTTPException(status_code=400, detail="Invalid time range")

    data = {
        "Datetime": df_range.index.strftime(datetime_format).tolist(),
        "airTemp": df_range['airTemp'].tolist(),
        "relativehumid": df_range['relativehumid'].tolist(),
        "atm": df_range['atm'].tolist(),
        "windSpeed": df_range['windSpeed'].tolist(),
        "windDirect": df_range['windDirect'].tolist(),
    }
    return (JSONResponse(content=data))


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
:windDirect

