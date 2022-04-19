import { prepareConnection } from "db/index";
import { Article } from "db/entity";
import { useState } from "react";
//observer 函数/装饰器可以用来将 React 组件转变成响应式组件
import { observer } from "mobx-react-lite";
import styles from "./index.module.scss";
import MarkDown from "markdown-to-jsx";
import Link from "next/link";
import { IArticle } from "pages/api/index";
import { format } from "date-fns";
import { useStore } from "store/index";
import { Avatar, Button, Input, Divider } from "antd";
interface IProps {
  article: IArticle;
}
export async function getServerSideProps({ params }: any) {
  //params路由携带参数
  const articleId = params?.id;
  const db = await prepareConnection();
  const articleRepo = db.getRepository(Article);
  const article = await articleRepo.findOne({
    where: {
      id: articleId,
    },
    relations: ["user"],
  });
  if (article) {
    article.views = article?.views + 1;
    await articleRepo.save(article);
  }
  return {
    props: {
      article: JSON.parse(JSON.stringify(article)) || [],
    },
  };
}
const ArticleDetail = (props: IProps) => {
  const { article } = props;
  const store = useStore();
  const loginUserInfo = store?.user?.userInfo;
  // const {
  //   user: { nickname, avatar, id },
  // } = article;
  const {
    user: { nickname, id },
  } = article;
  const [inputVal, setInputVal] = useState("");
  const [comments, setComments] = useState(article?.comments || []);
  const handleComment = () => {
    setComments;
  };
  return (
    <div>
      <div className="content-layout">
        <h2 className={styles.title}>{article?.title}</h2>
        <div className={styles.user}>
          {/* <Avatar src={avatar} size={50}></Avatar> */}
          <Avatar
            src={
              "http://wenzhuhao.oss-cn-beijing.aliyuncs.com/2022-04/18/6346php5E17.tmp1650273810220418.jpg"
            }
            size={50}
          ></Avatar>
          <div className={styles.info}>
            <div className={styles.name}>{nickname}</div>
            <div className={styles.date}>
              <div>
                {format(new Date(article?.update_time), "yyyy-MM-dd hh:mm:ss")}
              </div>
              <div>阅读 {article?.views}</div>
              {Number(loginUserInfo?.userId) === Number(id) && (
                <Link href={`/editor/${article?.id}`}>编辑</Link>
              )}
            </div>
          </div>
        </div>
        {/* <Avatar src={avatar} size={50}></Avatar> */}

        <MarkDown className={styles.markdown}>{article?.content}</MarkDown>
      </div>
      <div className={styles.divider}></div>
      <div className="content-layout">
        <div className={styles.comment}>
          <h3>评论</h3>
          {loginUserInfo?.userId && (
            <div className={styles.enter}>
              {/* <Avatar src={avatar} size={40} /> */}
              <Avatar
                src={
                  "http://wenzhuhao.oss-cn-beijing.aliyuncs.com/2022-04/18/6346php5E17.tmp1650273810220418.jpg"
                }
                size={50}
              ></Avatar>
              <div className={styles.content}>
                <Input.TextArea
                  placeholder="请输入评论"
                  rows={4}
                  value={inputVal}
                  onChange={(event) => setInputVal(event?.target?.value)}
                />
                <Button type="primary" onClick={handleComment}>
                  发表评论
                </Button>
              </div>
            </div>
          )}
          <Divider />
          <div className={styles.display}>
            {comments?.map((comment: any) => (
              <div className={styles.wrapper} key={comment?.id}>
                <Avatar src={comment?.user?.avatar} size={40} />
                <div className={styles.info}>
                  <div className={styles.name}>
                    <div>{comment?.user?.nickname}</div>
                    <div className={styles.date}>
                      {format(
                        new Date(comment?.update_time),
                        "yyyy-MM-dd hh:mm:ss"
                      )}
                    </div>
                  </div>
                  <div className={styles.content}>{comment?.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default observer(ArticleDetail);
