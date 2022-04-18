import { IronSession } from "iron-session";
import { IUserInfo } from "store/userStore";
// eslint-disable-next-line no-redeclare
export type IArticle = {
  id: number,
  title: string,
  content: string,
  create_time: Date,
  update_time: Date,
  views: number,
  user: IUserInfo,
};
export type ISession = IronSession & Record<string, any>;
