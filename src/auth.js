import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialProvider from "next-auth/providers/credentials";

import { getUserByEmail } from "./data/users";

export const {
    handlers: {GET, POST},
    auth,
    signIn,
    signOut
} = NextAuth ({
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialProvider({
            async authorize(credentials) {
                console.log('credentials: ',credentials);
                if(credentials === null) return null;
                try {
                    const user = getUserByEmail(credentials?.email);
                    if(user) {
                        const isMatch = user.password === credentials?.password
                        if(isMatch) {
                            return {
                                id: user.email,
                                name: user.username,
                                email: user.email,
                                username: user.username,
                            }
                        } else {
                            throw new Error("Check Your Password!");
                        }
                    } else {
                        throw new Error("User Not Found!");
                    }
                } catch (error) {
                    throw new Error("Internal Server Error");
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                }
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Add user data to the token
                token.name = user.name;
                token.email = user.email;
                token.username = user.username; 
            }
            return token;
        },
        async session({ session, token }) {
            // Add token data to the session
            if (token) {
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.username = token.username;
            }
            return session;
        },
    },
})
// http://localhost:3000/api/auth/callback/google