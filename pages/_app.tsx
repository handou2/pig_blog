import Layout from "../components/layout";
import "styles/globals.css";
import { StoreProvider } from "store/index";
import { NextPage } from "next";
interface IProps {
  initialValue: Record<any, any>;
  Component: NextPage;
  pageProps: any;
}
function MyApp({ Component, pageProps, initialValue }: IProps) {
  return (
    <StoreProvider initialValue={initialValue}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  );
}
MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  const { userId, nickname, avatar } = ctx?.req.cookies || {};
  // console.log(ctx?.req.cookies);
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
