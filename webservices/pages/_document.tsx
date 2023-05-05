import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.4.0/css/all.css" integrity="sha384-Gv1sIydWxS+MzL0F0ilv6wkBdPY4du4AC2Dy4EYw6UuuZ6sKFJxL18VOeJzvymXb" crossOrigin="anonymous" />
         <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.0/css/bulma.min.css"
        />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
