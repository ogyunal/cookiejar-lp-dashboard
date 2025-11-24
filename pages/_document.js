import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/images/icon.png" />
        <link rel="apple-touch-icon" href="/images/icon.png" />
        <meta name="theme-color" content="#D4A574" />
        
        {/* DataFast Analytics - Main Site */}
        <script
          defer
          data-website-id="dfid_t5ZcGWP4cfNCt3YDrggni"
          data-domain="thecookiejar.app"
          src="https://datafa.st/js/script.js"
        />
        
        {/* DataFast Analytics - Creator Dashboard */}
        <script
          defer
          data-website-id="dfid_a2hJ9XvOxMZRLEycvaaLo"
          data-domain="creator.thecookiejar.app"
          src="https://datafa.st/js/script.js"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

