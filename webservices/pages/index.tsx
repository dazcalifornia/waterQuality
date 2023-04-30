import {useState,useEffect,useCallback} from 'react'
import { 
  PageLayout,
  Box,
  ThemeProvider,
} from '@primer/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import Contents from '../components/Contents'


const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] = useState('home')

  
  return (
    <ThemeProvider >
    <div>
      <Head>
        <title>waterData insight :{selectedTab}</title>
        <meta name="description" content="webpage show water quality" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <PageLayout.Header>
          <Nav setSelectedTab={setSelectedTab} selectedTab={selectedTab} />
        </PageLayout.Header>
        <PageLayout.Content>
          <Contents selectedTab={selectedTab} />
        </PageLayout.Content>
        <PageLayout.Pane>
          <Box sx={{borderWidth: 1, borderStyle: 'solid', borderColor: 'border.default', p: 3,borderRadius:10}}>
            <p>
                show water quality data from datacenter and data from north bongkot 
            </p>
          </Box>
        </PageLayout.Pane>
        <PageLayout.Footer>
          <Footer />
        </PageLayout.Footer>
      </PageLayout>
      
    </div>
    </ThemeProvider>
  )
}


export default Home
