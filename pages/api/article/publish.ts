import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "config/index";
//ISession保存数据在内存中
import { ISession } from "pages/api/index";
import { prepareConnection } from "db/index";
import { User, Article, Tag } from "db/entity/index";
import { EXCEPTION_ARTICLE } from "pages/api/config/codes";

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  // console.log(3333333);
  // console.log(res);
  const session: ISession = req.session;
  const { title = "", content = "", tagIds = [] } = req.body;
  const db = await prepareConnection();
  //数据库操作
  const userRepo = db.getRepository(User);
  const articleRepo = db.getRepository(Article);
  const tagRepo = db.getRepository(Tag);
  const article = new Article();
  // console.log(1111111);
  // console.log(articleRepo);
  const user = await userRepo.findOne({
    id: session.userId,
  });
  const tags = await tagRepo.find({
    where: tagIds?.map((tagId: number) => ({
      id: tagId,
    })),
  });

  article.title = title;
  article.content = content;
  article.create_time = new Date();
  article.update_time = new Date();
  article.is_delete = 0;
  article.views = 0;
  // console.log(22222222);
  // console.log(user);
  if (user) {
    article.user = user;
  }
  if (tags) {
    const newTags = tags?.map((tag) => {
      tag.article_count = tag?.article_count + 1;
      return tag;
    });
    article.tags = newTags;
  }
  const resArticle = await articleRepo.save(article);
  if (resArticle) {
    res.status(200).json({ data: resArticle, code: 0, msg: "发布成功" });
  } else {
    res.status(200).json({ ...EXCEPTION_ARTICLE.PUBLISH_FAILED });
  }
}
