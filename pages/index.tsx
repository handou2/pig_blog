import { prepareConnection } from "db/index";
import { Article } from "db/entity";
import ListItem from "../components/ListItem/index";
import { IArticle } from "pages/api/index";
import { Divider } from "antd";
interface IProps {
  articles: IArticle[];
}
export async function getServerSideProps() {
  const db = await prepareConnection();
  const articles = await db.getRepository(Article).find({
    relations: ["user"],
  });
  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
    },
  };
}
const Home = (props: IProps) => {
  const { articles } = props;
  console.log(articles);
  return (
    <div>
      <div className="content-layout">
        {articles?.map((article) => (
          <>
            <ListItem article={article} />
            <Divider />
          </>
        ))}
      </div>
    </div>
  );
};
export default Home;
