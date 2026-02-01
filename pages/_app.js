import '../frontend/index.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>Heart Buddy - Relationship Verification</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
