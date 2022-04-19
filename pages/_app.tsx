import Layout from "../components/layout";
import "styles/globals.css";
import { StoreProvider } from "store/index";
import { NextPage } from "next";
import styles from "./index.module.scss";
// import ParticlesBg from 'particles-bg'

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
  // let config = {
  //   num: [4, 7],
  //   rps: 0.1,
  //   radius: [5, 40],
  //   life: [1.5, 3],
  //   v: [2, 3],
  //   tha: [-40, 40],
  //   // body: "./img/icon.png", // Whether to render pictures
  //   // rotate: [0, 20],
  //   alpha: [0.6, 0],
  //   scale: [1, 0.1],
  //   position: "center", // all or center or {x:1,y:1,width:100,height:100}
  //   color: ["random", "#ff0000"],
  //   cross: "dead", // cross or bround
  //   random: 15,  // or null,
  //   g: 5,    // gravity
  //   // f: [2, -1], // force
  //   onParticleUpdate: (ctx:any, particle:any) => {
  //       ctx.beginPath();
  //       ctx.rect(particle.p.x, particle.p.y, particle.radius * 2, particle.radius * 2);
  //       ctx.fillStyle = particle.color;
  //       ctx.fill();
  //       ctx.closePath();
  //   }
  // };
  return (
    <StoreProvider initialValue={initialValue}>   
      <div className={styles.particles}>
      {/* <ParticlesBg type="custom" config={config} bg={true} /> */}
      {renderLayout()}
      </div>
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
