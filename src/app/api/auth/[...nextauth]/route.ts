import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { sql } from "@vercel/postgres";

const handler = NextAuth({
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.id = user.id;
            return token;
        },
    },
    pages: {
        signIn: "/login"
    },
    providers: [
        CredentialsProvider({
            credentials: {
                firstName: {},
                lastName: {},
                email: {},
                password: {}
            },
            async authorize(credentials, req) {

                const response = await sql`
                    SELECT * FROM users WHERE email=${credentials?.email}
                `;

                const user = response.rows[0];

                const passwordCorrect = await compare(credentials?.password || '', user.password);

                console.log(passwordCorrect);

                if (passwordCorrect) {
                    return {
                        id: user.id,
                        email: user.email
                    }
                }

                return null;
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };