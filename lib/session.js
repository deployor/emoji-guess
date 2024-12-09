

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD,
  cookieName: 'emoji-guess-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};