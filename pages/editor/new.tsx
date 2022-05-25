import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { ChangeEvent, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Input, Button,Select} from "antd";
import request from 'service/fetch'
import { useRouter } from 'next/router';
import { useStore } from 'store/index';
import { observer } from 'mobx-react-lite';
import { NotifyError, NotifySuccess,NotifyWarn } from "components/Notify";


const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const NewEditor = () => {
  const store = useStore();
  const {push} = useRouter();
  const { userId } = store.user.userInfo;
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tagIds, setTagIds] = useState([]);
  const [allTags, setAllTags] = useState([]);
  useEffect(()=>{
    request.get('/api/tag/get').then((res:any)=>{
      if(res?.code === 0){
        // console.log("tttttt")
        // console.log(res)
        setAllTags(res?.data?.allTags || [])
      }
    })
  },[])
  const handlePublish = () => {
    if (!title) {
      NotifyWarn("请输入文章标题")
      return ;
    }
    request.post('/api/article/publish', {
      title,
      content,
      tagIds
    }).then((res: any) => {
      if (res?.code === 0) {
        NotifySuccess('发布成功! 正在跳转页面')
          setTimeout(() => {
              userId ? push(`/user/${userId}`):push('/')
          }, 1000);
      } else {
        NotifyError(res?.msg || '发布失败')
      }
    })
  };
  const handleContentChange = (content:any) => {
    setContent(content)
  };
  const handleSelectTag = (value:[]) => {
    setTagIds(value)
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
        <Select 
          className={styles.tag} 
          mode="multiple"
          allowClear 
          placeholder="请选择标签"
          onChange={handleSelectTag}
        >
          {allTags?.map((tag:any)=>(
            <Select.Option key={tag?.id} value={tag?.id}>
              {tag?.title}
            </Select.Option>
          ))}
        </Select>
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
(NewEditor as any).layout = null;


export default observer(NewEditor);
