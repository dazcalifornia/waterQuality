import Head from 'next/head';
import Prism from '../prism';
import salinityImage from '../assets/images/salinity.png'
import cholorophy from '../assets/images/chorlophyl.png'
import conduct from '../assets/images/conduct.png'
import DoSturation from '../assets/images/DOsturation.png'
import seaTemp from '../assets/images/seatemp.png'
import turbidity from '../assets/images/tubidity.png'
export default function Home() {
  const code = `
  
data = pd.read_csv('/content/drive/MyDrive/GOT001-data-20200201-20210201.csv')
data.dtypes

data.isnull().sum()
# Calculate the mean value for each column
mean_values = data.mean()

# Replace missing values with the mean value for each column
data.fillna(value=mean_values, inplace=True)

# data.dropna(subset=['Salinity (PSU)', 'Conductivity (mS/cm)', 'pH', 'Turbidity (FTU)','Sea temperature (°C)', 'DO saturation (%)', 'Chlorophyll-a (ppb)'], inplace=True)

data.set_index('Datetime', inplace=True)
data.index = pd.to_datetime(data.index, format='%Y-%m-%d %H:%M:%S')
if type(data.index) == pd.DatetimeIndex:
    print("The index is ready for resampling.")
else:
    print("The index is not ready for resampling.")


data.to_csv('/content/drive/MyDrive/wqdb/corrective.csv', index=True)
data.head()

monthly_data = data.resample("M").mean()
daily_data = data.resample("D").interpolate()
plt.plot(monthly_data)
plt.xlabel("Month-Year")
plt.ylabel("Mean Value")
plt.title("Data by Month for 1 Years")
plt.show()


salinity = pd.read_csv('/content/drive/MyDrive/wqdb/salinity.csv')
salinity.set_index('Datetime', inplace=True)
salinity.index = pd.to_datetime(salinity.index, format='%Y-%m-%d %H:%M:%S')

# checking if it work
if type(salinity.index) == pd.DatetimeIndex:
    print("The index is ready for resampling.")
else:
    print("The index is not ready for resampling.")
monthly_data = salinity.resample("M").mean()
daily_data = salinity.resample("D").interpolate()

plt.plot(monthly_data)
plt.xlabel("Month-Year")
plt.ylabel("Mean Value")
plt.title("Data by Month for 1 Years")
plt.show()


conduct = pd.read_csv('/content/drive/MyDrive/wqdb/conduct.csv')
conduct.set_index('Datetime', inplace=True)
conduct.index = pd.to_datetime(conduct.index, format='%Y-%m-%d %H:%M:%S')

# checking if it work
if type(conduct.index) == pd.DatetimeIndex:
    print("The index is ready for resampling.")
else:
    print("The index is not ready for resampling.")
monthly_data = conduct.resample("M").mean()
daily_data = conduct.resample("D").interpolate()

plt.plot(monthly_data)
plt.xlabel("Month-Year")
plt.ylabel("Mean Value")
plt.title("Data by Month for 1 Years")
plt.show()

turbidity = pd.read_csv('/content/drive/MyDrive/wqdb/turbidity.csv')
turbidity.set_index('Datetime', inplace=True)
turbidity.index = pd.to_datetime(turbidity.index, format='%Y-%m-%d %H:%M:%S')

# checking if it work
if type(turbidity.index) == pd.DatetimeIndex:
    print("The index is ready for resampling.")
else:
    print("The index is not ready for resampling.")

monthly_data = turbidity.resample("M").mean()
daily_data = turbidity.resample("D").interpolate()

plt.plot(monthly_data)
plt.xlabel("Month-Year")
plt.ylabel("Mean Value")
plt.title("Data by Month for 1 Years")
plt.show()


seaTemp = pd.read_csv('/content/drive/MyDrive/wqdb/seaTemp.csv')
seaTemp.set_index('Datetime', inplace=True)
seaTemp.index = pd.to_datetime(seaTemp.index, format='%Y-%m-%d %H:%M:%S')

# checking if it work
if type(seaTemp.index) == pd.DatetimeIndex:
    print("The index is ready for resampling.")
else:
    print("The index is not ready for resampling.")

monthly_data = seaTemp.resample("M").mean()
daily_data = seaTemp.resample("D").interpolate()

plt.plot(monthly_data)
plt.xlabel("Month-Year")
plt.ylabel("Mean Value")
plt.title("Data by Month for 1 Years")
plt.show()


DoSturation = pd.read_csv('/content/drive/MyDrive/wqdb/DoSturation.csv')
DoSturation.set_index('Datetime', inplace=True)
DoSturation.index = pd.to_datetime(DoSturation.index, format='%Y-%m-%d %H:%M:%S')

# checking if it work
if type(DoSturation.index) == pd.DatetimeIndex:
    print("The index is ready for resampling.")
else:
    print("The index is not ready for resampling.")

monthly_data = DoSturation.resample("M").mean()
daily_data = DoSturation.resample("D").interpolate()

plt.plot(monthly_data)
plt.xlabel("Month-Year")
plt.ylabel("Mean Value")
plt.title("Data by Month for 1 Years")
plt.show()


cholorophy = pd.read_csv('/content/drive/MyDrive/wqdb/cholorophy.csv')
cholorophy.set_index('Datetime', inplace=True)
cholorophy.index = pd.to_datetime(cholorophy.index, format='%Y-%m-%d %H:%M:%S')

# checking if it work
if type(cholorophy.index) == pd.DatetimeIndex:
    print("The index is ready for resampling.")
else:
    print("The index is not ready for resampling.")

monthly_data = cholorophy.resample("M").mean()
daily_data = cholorophy.resample("D").interpolate()

plt.plot(monthly_data)
plt.xlabel("Month-Year")
plt.ylabel("Mean Value")
plt.title("Data by Month for 1 Years")
plt.show()

  `


  return (
    <div className='noisy bg-noisy'>

      <Head>
        <title>Audit Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
     
        <h1>Post Update</h1>
        <div className='content'>
        
        <div className='post-card'>
          <div>
             {/*this part is for post */}
        <h2>
            
        </h2>
        <div className='card-content'>
          <pre>
            <code
        dangerouslySetInnerHTML={{
          __html: Prism.highlight(code, Prism.languages.python, 'python'),
        }}
      />
          </pre>
          <img src={salinityImage.src} width="auto" height="auto" alt='salinity'/>
          <img src={conduct.src} width="auto" height="auto" alt='conduct'/>
          <img src={DoSturation.src} width="auto" height="auto" alt='DoSturation'/>
          <img src={turbidity.src} width="auto" height="auto" alt='turbidity'/>
          <img src={seaTemp.src} width="auto" height="auto" alt='seatemp'/>
          <img src={cholorophy.src} width="auto" height="auto" alt='cholorophy'/>
   

        </div>
        <form>
          <input type="checkbox" id="passmark" name="approve"/>
          <label htmlFor="passmark">Approve</label><br/>
          <input type="checkbox" id="notpassmark" name="notapprove"/>
          <label htmlFor="notpassmark">Not Approve</label><br/>
          <input type='text'/>
          <button type='submit'>summit</button>
        </form>

          </div>
        </div>
      </div>
    </div>
  )
}
