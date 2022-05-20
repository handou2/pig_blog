import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { IArticle } from "pages/api/index";
import { Avatar } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { markdownToTxt } from "markdown-to-txt";
import styles from "./index.module.scss";

interface IProps {
  article: IArticle;
}

const ListItem = (props: IProps) => {
  const { article } = props;
  const { user } = article;
  // console.log(article, "11");

  return (
    // eslint-disable-next-line @next/next/link-passhref
    <div className={styles.topContainer}>
      <Link href={`/article/${article.id}`}>
        <div className={styles.container}>
          <div className={styles.article}>
            <div className={styles.userInfo}>
              <span className={styles.name}>{user?.nickname}</span>
              <span className={styles.date}>
                {formatDistanceToNow(new Date(article?.update_time))}
              </span>
            </div>
            <h4 className={styles.title}>{article?.title}</h4>
            {article.content ? (
              <p className={styles.content}>
                {markdownToTxt(article?.content)}
              </p>
            ) : (
              ""
            )}

            <div className={styles.statistics}>
              <EyeOutlined />
              <span className={styles.item}>{article?.views}</span>
            </div>
          </div>
          {/* <Avatar src={user?.avatar} size={48} /> */}
          <Avatar
            src={
              "http://wenzhuhao.oss-cn-beijing.aliyuncs.com/2022-04/18/6346php5E17.tmp1650273810220418.jpg"
            }
            size={48}
          />
        </div>
      </Link>
    </div>
  );
};

export default ListItem;
