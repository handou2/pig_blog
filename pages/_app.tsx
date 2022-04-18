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
  const renderLayout =()=>{
    if((Component as any).layout === null){
      return <Component {...pageProps} />
    }else{
      return (
        <Layout>
        <Component {...pageProps} />
      </Layout>
      )
    }

  }
  return (
    <StoreProvider initialValue={initialValue}>
     {renderLayout()}
    </StoreProvider>
  );
}
MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  const { userId, nickname, avatar } = ctx?.req?.cookies || {};
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
