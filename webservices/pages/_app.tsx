import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {ThemeProvider} from '@primer/react'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
