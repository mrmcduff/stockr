import { NextApiHandler } from 'next';
import NextAuth, { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from "next-auth/providers/google"
import prisma from 'lib/prisma';

const options: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  adapter: PrismaAdapter(prisma),
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;
// import NextAuth from "next-auth/next"
// import { config } from "auth"

// const handler = NextAuth(config)
// export default handler;
