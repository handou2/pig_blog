import { useState } from "react";
import { observer } from "mobx-react-lite";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Avatar, Dropdown, Menu } from "antd";
import { LoginOutlined, HomeOutlined } from "@ant-design/icons";
import request from "service/fetch";
import { useStore } from "store/index";
import Login from "components/Login";
import styles from "./index.module.scss";
import { navs } from "./config";
import { NotifyWarn } from "components/Notify";

const Navbar: NextPage = () => {
  const store = useStore();
  const { userId } = store.user.userInfo;
  const { pathname, push } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);

  const handleGotoEditorPage = () => {
    if (userId) {
      push("/editor/new");
    } else {
      NotifyWarn("请先登录");
      // message.warning("请先登录");
    }
  };

  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    setIsShowLogin(false);
  };

  const handleGotoPersonalPage = () => {
    push(`/user/${userId}`);
  };

  const handleLogout = () => {
    request.post("/api/user/logout").then((res: any) => {
      if (res?.code === 0) {
        store.user.setUserInfo({});
      }
    });
  };

  const renderDropDownMenu = () => {
    return (
      <Menu>
        <Menu.Item onClick={handleGotoPersonalPage}>
          <HomeOutlined />
          &nbsp; 个人主页
        </Menu.Item>
        <Menu.Item onClick={handleLogout}>
          <LoginOutlined />
          &nbsp; 退出系统
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG-PIG</section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link key={nav?.label} href={nav?.value}>
            {/* 判断当前路径是否为点击路径 */}
            <a className={pathname === nav?.value ? styles.active : ""}>
              {nav?.label}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>

        {userId ? (
          <>
            <Dropdown overlay={renderDropDownMenu()} placement="bottomLeft">
              {/* <Avatar src={avatar} size={32} /> */}
              <Avatar
                src={
                  "http://wenzhuhao.oss-cn-beijing.aliyuncs.com/2022-04/18/6346php5E17.tmp1650273810220418.jpg"
                }
                size={32}
              />
            </Dropdown>
          </>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            登录
          </Button>
        )}
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default observer(Navbar);
