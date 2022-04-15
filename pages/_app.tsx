import Layout from "../components/layout";
import "styles/globals.css";
import type { AppProps } from "next/app";
import { StoreProvider } from "store/index";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider initialValue={{ use: {} }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  );
}

export default MyApp;
