import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig = {
    pages: {
        signIn: '/',
        signOut: '/',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            // 「!!」は二重否定。undefinedのようなboolean判定されない状態の場合に、エラーを発生せずにfalse扱いにする
            // 「?.」は「オプショナルチェーン」と言われ、指定したキー名が未定義でもエラーではなく「undefined」になるようにする
            const isLoggedIn = !!auth?.user;

            const isOnNeedMasterAuth = nextUrl.pathname.startsWith('/master/menu')
            const isOnNeedMemberAuth = nextUrl.pathname.startsWith('/member/menu')

            if (isOnNeedMasterAuth || isOnNeedMemberAuth) {
                if (isLoggedIn){
                    // アカウントのタイプによって分岐
                    const accountType = auth?.user?.type;
                    switch(true){
                        case accountType == 'master':
                            if(isOnNeedMasterAuth){
                                return true;
                            }
                            break;
                        case accountType == 'member':
                            if(isOnNeedMemberAuth){
                                return true;
                            }
                            break;
                    }
                    return false;

                }else{
                    const url = nextUrl.clone();
                    switch(true){
                        case isOnNeedMasterAuth:
                            url.pathname = '/master/login';
                        break;
                        case isOnNeedMemberAuth:
                            url.pathname = '/member/login';
                        break;
                    }

                    url.searchParams.set('callbackUrl', nextUrl.pathname);

                    return Response.redirect(url);
                }
            } else if (isLoggedIn) {
                const accountType = auth?.user?.type;

                switch(true){
                    case accountType == 'master':
                        return Response.redirect(new URL('/master/menu', nextUrl))
                        break;
                    case accountType == 'member':
                        return Response.redirect(new URL('/member/menu', nextUrl))
                        break;
                }
            }

            return true;
        },
        jwt({ token, user }) {
            // console.log('auth.config.ts');
            // console.log('jwt');
            // console.log(token);
            // console.log(user);

            // ここでtokenにuserの情報をセットして下のsessionに渡る
            if (user) { // User is available during sign-in]
                token.userId = user.userId
                token.type = user.type
            }
            return token
        },
        session({ session, token }) {
            // console.log('auth.config.ts');
            // console.log('session');
            // console.log(session);
            // console.log(token);

            // 上のjwtから渡ったtokenの内容をsessionにセットして一番上のauthorizedに行く
            session.user.userId = token.userId
            session.user.type = token.type

            return session
        },
    },
    providers: [],
} satisfies NextAuthConfig;