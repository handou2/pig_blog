import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "config/index";
//ISession保存数据在内存中
// import { ISession } from "pages/api/index";
import { prepareConnection } from "db/index";
import { Article } from "db/entity/index";
import { EXCEPTION_ARTICLE } from "pages/api/config/codes";

export default withIronSessionApiRoute(update, ironOptions);

async function update(req: NextApiRequest, res: NextApiResponse) {
  // console.log(3333333);

  const { title = "", content = "", id = "" } = req.body;
  const db = await prepareConnection();
  //数据库操作
  const articleRepo = db.getRepository(Article);
  const article = await articleRepo.findOne({
    where: {
      id,
    },
    relations: ["user"],
  });
  if (article) {
    article.title = title;
    article.content = content;
    article.update_time = new Date();
    const resArticle = await articleRepo.save(article);
    if (resArticle) {
      res.status(200).json({ data: resArticle, code: 0, msg: "更新成功" });
    } else {
      res.status(200).json({ ...EXCEPTION_ARTICLE.UPDATE_FAILED });
    }
  } else {
    res.status(200).json({ ...EXCEPTION_ARTICLE.NOT_FOUND });
  }
}
