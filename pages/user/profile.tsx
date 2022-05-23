import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Form, Input, Button } from "antd";
import request from "service/fetch";
import styles from "./index.module.scss";
import { NotifyError, NotifySuccess } from "components/Notify";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 4 },
};

const UserProfile = () => {
  const [form] = Form.useForm();
  useEffect(() => {
    request.get("/api/user/detail").then((res: any) => {
      if (res?.code === 0) {
        //加载后端数据并展示，并且用户可以进行修改form表单的数据
        // console.log("345");
        // console.log(res);
        form.setFieldsValue(res?.data?.userInfo);
      }
    });
  }, [form]);
  const handleSubmit = (values: any) => {
    request.post("/api/user/update", { ...values }).then((res: any) => {
      if (res?.code === 0) {
        NotifySuccess("修改成功");
      } else {
        NotifyError(res?.msg || "修改失败");
      }
    });
  };
  return (
    <div className="content-layout">
      <div className={styles.userProfile}>
        <h2>个人资料</h2>
        <div>
          <Form
            {...layout}
            form={form}
            className={styles.form}
            onFinish={handleSubmit}
          >
            <Form.Item
              label="用户名"
              name="nickname"
              rules={[
                { required: true, message: "Please input your nickname!" },
              ]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              label="职位"
              name="job"
              rules={[{ required: true, message: "Please input your job!" }]}
            >
              <Input placeholder="请输入职位" />
            </Form.Item>
            <Form.Item
              label="个人介绍"
              name="introduce"
              rules={[
                { required: true, message: "Please input your introduce!" },
              ]}
            >
              <Input placeholder="请输入个人介绍" />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                保存修改
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default observer(UserProfile);
