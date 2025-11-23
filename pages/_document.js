import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/images/icon.png" />
        <link rel="apple-touch-icon" href="/images/icon.png" />
        <meta name="theme-color" content="#D4A574" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

