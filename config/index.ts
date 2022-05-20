export const ironOptions = {
  cookieName: process.env.SESSION_COOKIE_NAME as string,
  password: process.env.SESSION_PASSWORD as string,
  cookieOptions: {
    //设置cookie过期时间
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
  },
};
