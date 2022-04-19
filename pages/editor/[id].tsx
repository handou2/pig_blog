import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { ChangeEvent, useState } from "react";
import styles from "./index.module.scss";
import { Input, Button,message } from "antd";
import request from 'service/fetch'
import { useRouter } from 'next/router';
// import { useStore } from 'store/index';
import { observer } from 'mobx-react-lite';
import { prepareConnection } from "db/index";
import { Article } from "db/entity";
import { IArticle } from "pages/api";
interface IProps{
    article:IArticle
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
    return {
      props: {
        article: JSON.parse(JSON.stringify(article)),
      },
    };
  }


const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const ModifyEditor = ({article}:IProps) => {
//   const store = useStore();
  const {push,query} = useRouter();
  const articleId = Number(query?.id)
//   const { userId } = store.user.userInfo;
  const [content, setContent] = useState(article?.content || '');
  const [title, setTitle] = useState(article?.title || '');
  const handlePublish = () => {
    if(!title){
      message.warning('请输入文章标题')
    }else{
      request.post('/api/article/update',{
        id:articleId,
        title,
        content
      }).then((res:any)=>{
        if(res?.code === 0){
          articleId ? push(`/article/${articleId}`):push('/')
          message.success('更新成功')
        }else{
          message.error(res?.msg || '更新失败')
        }
      })
    }
  };
  const handleContentChange = (content:any) => {
    setContent(content)
  };
  const handleTitleChange = (event:ChangeEvent<HTMLInputElement>) => {
    setTitle(event?.target?.value);
  };
  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input
          className={styles.title}
          placeholder="请输入文章标题"
          value={title}
          onChange={handleTitleChange}
        ></Input>
        <Button
          className={styles.button}
          type="primary"
          onClick={handlePublish}
        >
          发布
        </Button>
      </div>
      <MDEditor value={content} onChange={handleContentChange} height={1080} />
    </div>
  );
};
(ModifyEditor as any).layout = null;


export default observer(ModifyEditor);
