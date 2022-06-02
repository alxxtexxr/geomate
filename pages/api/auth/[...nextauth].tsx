import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import prisma from '../../../lib/prisma';

// Types
import type { NextApiHandler } from 'next';
import type { NextAuthOptions } from 'next-auth';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options as NextAuthOptions);

export default authHandler;

const options = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        }),
    ],
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        redirect: () => process.env.NEXTAUTH_URL,
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
};