//发送短信请求相关目录
//用户获取验证码后接口请求平台获取验证码并保存在内存中,登录时用户发送手机号和验证码,接口比较验证码是否正确并返回res
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { format } from 'date-fns';
import md5 from 'md5';
import { encode } from 'js-base64';
import request from 'service/fetch';
import { ISession } from 'pages/api/index';
import { ironOptions } from 'config/index';

export default withIronSessionApiRoute(sendVerifyCode, ironOptions);

async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  //拿到request的数据
  const { to = '', templateId = '1' } = req.body;
  const AppId = '8aaf070880082831018020982df7061c';
  const AccountId = '8aaf070880082831018020982cf00615';
  const AuthToken = '3e79d1afc4374f1fb5a8c0cbdfbeca89';
  const NowDate = format(new Date(), 'yyyyMMddHHmmss');
  const SigParameter = md5(`${AccountId}${AuthToken}${NowDate}`);
  const Authorization = encode(`${AccountId}:${NowDate}`);
  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  //验证码过期时间
  const expireMinute = '5';
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`;

  const response = await request.post(
    url,
    {
      to,
      templateId,
      appId: AppId,
      datas: [verifyCode, expireMinute],
    },
    {
      headers: {
        Authorization,
      },
    }
  );

  // console.log(verifyCode)
  // console.log(response);
  const { statusCode, templateSMS, statusMsg } = response as any;

  if (statusCode === '000000') {
    //将生成的verifyCode保存在session(内存)里面
    session.verifyCode = verifyCode;
    await session.save();
    res.status(200).json({
      code: 0,
      msg: statusMsg,
      data: {
        templateSMS
      }
    });
  } else {
    res.status(200).json({
      code: statusCode,
      msg: statusMsg
    });
  }
}
