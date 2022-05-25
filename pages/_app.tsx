import '../styles/globals.css';
import { StoreProvider } from 'store/index';
import ErrorBoundary from 'components/ErrorBoundary';
import Layout from 'components/layout';
import { NextPage } from 'next';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IProps {
  initialValue: Record<any, any>;
  Component: NextPage;
  pageProps: any;
}

export function reportWebVitals(mertic: any) {
  if (mertic.label === 'web-vital') {
    // console.log('mertic', mertic);
  }

  switch (mertic.name) {
    case 'FCP':
      console.log('FCP', mertic);
      break;
    case 'LCP':
      console.log('LCP', mertic);
      break;
    case 'CLS':
      console.log('CLS', mertic);
      break;
    case 'FID':
      console.log('FID', mertic);
      break;
    case 'TTFB':
      console.log('TTFB', mertic);
      break;
    default:
      break;
  }

  const body = JSON.stringify(mertic);
  const url = 'https://xxxx.com';

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: 'POST', keepalive: true })
  }
}
function MyApp({ initialValue, Component, pageProps }: IProps) {
  const renderLayout = () => {
    if ((Component as any).layout === null) {
      return (
        <div>
          <Component {...pageProps} />
          <ToastContainer position="bottom-left" pauseOnHover autoClose={5000} />
        </div>
      )
    } else {
      return (
        <Layout>
          <Component {...pageProps} />
          <ToastContainer position="bottom-left" pauseOnHover autoClose={5000} />
        </Layout>
      );
    }
  };

  return (
    <ErrorBoundary>
      <StoreProvider initialValue={initialValue}>
        {renderLayout()}
      </StoreProvider>
    </ErrorBoundary>
  );
}

MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  const { userId, nickname, avatar } = ctx?.req?.cookies || {};

  return {
    initialValue: {
      user: {
        userInfo: {
          userId,
          nickname,
          avatar,
        },
      },
    },
  };
};

export default MyApp;
