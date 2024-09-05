import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcrypt';
// import { User } from './lib/definitions';

async function getMasterUser(email: string){
    const loginUser = await prisma.masters.findFirst({
        where: {email: email}
    })

    return loginUser;
}

async function getMemberUser(email: string){
    const loginUser = await prisma.members.findFirst({
        where: {email: email}
    })

    return loginUser;
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials){
                const parsedCredentials = z
                    .object({email: z.string().email(), password: z.string().min(6)})
                    .safeParse(credentials);

                if(parsedCredentials.success){
                    const {email, password} = parsedCredentials.data;

                    // callbackUrlに含まれる文字列を参照してログインするアカウントを判断
                    const callbackUrl = String(credentials.callbackUrl);

                    switch(true){
                        case callbackUrl.includes('/master/login'):
                            const master = await getMasterUser(email);
                            if(!master) return null;

                            const passwordMasterMatch = await bcrypt.compare(password, master.password);

                            if(passwordMasterMatch) return master;
                            break;
                        case callbackUrl.includes('/member/login'):
                            const member = await getMemberUser(email);
                            if(!member) return null;

                            const passwordMemberMatch = await bcrypt.compare(password, member.password);

                            if(passwordMemberMatch) return member;
                            break;
                    }
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // console.log('auth.ts');

            if (user) {
                token.id = user.id;
                token.userId = user.userId;
                if(!!user?.lastName){
                    token.type = 'member';
                    token.lastName = user.lastName;
                    token.firstName = user.firstName;
                }else{
                    token.type = 'master';
                }
            }

            return token;
        },
        async session({ session, token, user }) {
            if(token){
                session.user.id = token.id;
                session.user.userId = token.userId;
                session.user.type = token.type;
                if(token.type == 'member'){
                    session.user.lastName = token.lastName;
                    session.user.firstName = token.firstName;
                }
            }

            return session;
        },
        async redirect({url, baseUrl}){

            // ログイン認証後のリダイレクト先のURLをカスタマイズ
            switch(true){
                case url == `${baseUrl}/master/login`:
                    return `${baseUrl}/master/menu`;
                    break;
                case url == `${baseUrl}/member/login`:
                    return `${baseUrl}/member/menu`;
                    break;
            }

            return baseUrl;
        }
    },
})