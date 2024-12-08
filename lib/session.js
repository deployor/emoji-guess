
import { IronSessionOptions } from 'iron-session';

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD,
  cookieName: 'emoji-guess-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

// This configuration is used in API routes with `withIronSessionApiRoute`