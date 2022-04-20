import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { ChangeEvent, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Input, Button,message} from "antd";
import request from 'service/fetch'
import { useRouter } from 'next/router';
import { useStore } from 'store/index';
import { observer } from 'mobx-react-lite';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const NewEditor = () => {
  const store = useStore();
  const {push} = useRouter();
  const { userId } = store.user.userInfo;
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  // const [allTags, setAllTags] = useState([]);
  useEffect(()=>{
    request.get('/api/tag/get').then((res:any)=>{
      if(res?.code === 0){
        // setAllTags(res?.data?.allTags || [])
      }
    })
  },[])
  const handlePublish = () => {
    if(!title){
      toast.warn('🦄 请输入文章标题!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
      // message.warning('请输入文章标题')
    }else{
      request.post('/api/article/publish',{
        title,
        content
      }).then((res:any)=>{
        if(res?.code === 0){
          toast.success('🦄 发布成功! 正在跳转页面', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
          setTimeout(() => {
              userId ? push('/user/${userId}'):push('/')
          }, 5000);
          
          // message.success('发布成功')
        }else{
          message.error(res?.msg || '发布失败')
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
     <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        />
      {/* Same as */}
      <ToastContainer />
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
(NewEditor as any).layout = null;


export default observer(NewEditor);
