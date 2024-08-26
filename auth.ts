import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcrypt';
// import { User } from './lib/definitions';

async function getOwnerUser(email: string){
    const loginUser = await prisma.owners.findFirst({
        where: {email: email}
    })

    return loginUser;
}

async function getCustomerUser(email: string){
    const loginUser = await prisma.customers.findFirst({
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
                        case callbackUrl.includes('/owner/login'):
                            const owner = await getOwnerUser(email);
                            if(!owner) return null;

                            const passwordOwnerMatch = await bcrypt.compare(password, owner.password);

                            if(passwordOwnerMatch) return owner;
                            break;
                        case callbackUrl.includes('/customer/login'):
                            const customer = await getCustomerUser(email);
                            if(!customer) return null;

                            const passwordCustomerMatch = await bcrypt.compare(password, customer.password);

                            if(passwordCustomerMatch) return customer;
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
                    token.type = 'customer';
                    token.lastName = user.lastName;
                    token.firstName = user.firstName;
                }else{
                    token.type = 'owner';
                }
            }

            return token;
        },
        async session({ session, token, user }) {
            if(token){
                session.user.id = token.id;
                session.user.userId = token.userId;
                session.user.type = token.type;
                if(token.type == 'customer'){
                    session.user.lastName = token.lastName;
                    session.user.firstName = token.firstName;
                }
            }

            return session;
        },
        async redirect({url, baseUrl}){

            // ログイン認証後のリダイレクト先のURLをカスタマイズ
            switch(true){
                case url == `${baseUrl}/owner/login`:
                    return `${baseUrl}/owner/menu`;
                    break;
                case url == `${baseUrl}/customer/login`:
                    return `${baseUrl}/customer/menu`;
                    break;
            }

            return baseUrl;
        }
    },
})