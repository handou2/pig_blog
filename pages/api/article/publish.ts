import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { Cookie } from "next-cookie";
import { ironOptions } from "config/index";
//ISession保存数据在内存中
import { ISession } from "pages/api/index";
import { setCookie } from "utils/index";
import { prepareConnection } from "db/index";
import { User, Article } from "db/entity/index";

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { title = "", content = "" } = req.body;
  const db = await prepareConnection();
  //数据库操作
  const userRepo = await db.getRepository(User);
  const articleRepo = await db.getRepository(User);
  const article = new Article();

  const user = userRepo.findOne({
    id: session.userId,
  });
  article.title = title;
  article.content = content;
  article.create_time = new Date();
  article.update_time = new Date();
  article.is_delete = 0;
  article.views = 0;
}
