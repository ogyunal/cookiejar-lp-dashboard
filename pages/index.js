import Head from 'next/head';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import ForCreators from '../components/landing/ForCreators';
import Footer from '../components/landing/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>CookieJar - Bite-Sized Mobile Games</title>
        <meta 
          name="description" 
          content="Swipe, play, discover. The TikTok of mobile gaming. Thousands of indie games at your fingertips." 
        />
        <meta property="og:title" content="CookieJar - Bite-Sized Mobile Games" />
        <meta 
          property="og:description" 
          content="Swipe, play, discover. The TikTok of mobile gaming." 
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thecookiejar.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ForCreators />
        <Footer />
      </main>
    </>
  );
}

