import { 
  PageLayout,
  TabNav,
  Box
} from '@primer/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Footer from '../components/Footer'
import Nav from '../components/Nav'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <PageLayout.Header>
          <Nav />
        </PageLayout.Header>
        <PageLayout.Content>
          <Box sx={{borderWidth: 1, borderStyle: 'solid', borderColor: 'border.default', p: 3,borderRadius:10}}>Hello</Box>
        </PageLayout.Content>
        <PageLayout.Pane>
          <Box sx={{borderWidth: 1, borderStyle: 'solid', borderColor: 'border.default', p: 3,borderRadius:10}}>Pane</Box>
        </PageLayout.Pane>
        <PageLayout.Footer>
          <Footer />
        </PageLayout.Footer>
      </PageLayout>
      
    </div>
  )
}

export default Home
