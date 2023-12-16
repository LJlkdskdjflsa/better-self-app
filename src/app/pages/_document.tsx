import Document, { Html, Head, Main, NextScript } from 'next/document';

class BetterSelfDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          <meta name="apple-mobile-web-app-title" content="App Title" />
          <link rel="apple-touch-icon" href="/path/to/ios-icon.png" />
          <script src="https://cdn.jsdelivr.net/gh/logspace-ai/langflow-embedded-chat@main/dist/build/static/js/bundle.min.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default BetterSelfDocument;
