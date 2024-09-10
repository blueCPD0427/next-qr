import NextAuth from "next-auth"

declare module "next-auth" {
    /**
     * sessionに含めるユーザー情報の定義
     */
    interface Session {
        user: {
            /** The user's Id. */
            id: string
            userId: number
            type?: string
            lastName?: string
            firstName?: string
            name?: string
        }
    }
    interface User{
        userId: number
        type?: string
        lastName?: string
        firstName?: string
        name?: string
    }

}