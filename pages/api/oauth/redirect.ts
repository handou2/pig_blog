import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { Cookie } from "next-cookie";
import { ironOptions } from "config/index";
//ISession保存数据在内存中
import { ISession } from "pages/api/index";
import { setCookie } from "utils/index";
import { prepareConnection } from "db/index";
import { User, UserAuth } from "db/entity/index";
import request  from "service/fetch";


export default withIronSessionApiRoute(redirect, ironOptions);

async function redirect(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  //http://localhost:3000/api/oauth/redirect?code=xxxx
  const { code } = req?.query || {};
  const githubClientID = "56bbb549f26cabc29e2c";
  const githubSecrect = '9d27e374095830eaa514060bed10081d3c33034c'
  const url = `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubSecrect}&code=${code}`
  const result = await request.post(
      url,
      {},
      {
          headers:{
              accept:'application/json'
          }
      }
  )
  //从result里面拿到一个access_token
  const {access_token} = result as any

  const githubUserInfo = await request.get('https://api.github.com/user', {
    headers: {
      accept: 'application/json',
      Authorization: `token ${access_token}`
    }
  })
  const cookies = Cookie.fromApiRoute(req, res);
  //建立数据库连接
  const db = await prepareConnection()
  const userAuth = await db.getRepository(UserAuth).findOne({
      identity_type:'github',
      identifier:githubClientID
  },{
      //关联user表
      relations:['user']
  });
  if (userAuth) {
    // 之前登录过的用户，直接从 user 里面获取用户信息，并且更新 credential
    const user = userAuth.user;
    const { id, nickname, avatar } = user;

    // console.log(6666666)
    // console.log(user)

    userAuth.credential = access_token;

    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;

    await session.save();

    setCookie(cookies, { id, nickname, avatar });

    res.writeHead(302, {
      Location: '/'
    });
  } else {
    // 创建一个新用户，包括 user 和 user_auth
    const { login = '', avatar_url = '' } = githubUserInfo as any;
    const user = new User();
    user.nickname = login;
    user.avatar = avatar_url;

    const userAuth = new UserAuth();
    userAuth.identity_type = 'github';
    userAuth.identifier = githubClientID;
    userAuth.credential = access_token;
    userAuth.user = user;

    const userAuthRepo = db.getRepository(UserAuth);
    const resUserAuth = await userAuthRepo.save(userAuth);

    // console.log(77777)
    // console.log(resUserAuth)

    const { id, nickname, avatar } = resUserAuth?.user || {};
    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;

    await session.save();

    setCookie(cookies, { id, nickname, avatar });

    res.writeHead(302, {
      Location: '/'
    });
  } 
}
