import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialProvider from "next-auth/providers/credentials";

import User from "./model/user-model";
import bcrypt from 'bcrypt';

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
                    const user = await User.findOne({ email: credentials.email }).select('+password');
                    console.log(user);

                    if (user) {
                        const isMatch = await bcrypt.compare(credentials.password, user.password);
                        console.log('Password match:', isMatch);

                        if (isMatch) {
                            return {
                                id: user._id.toString(),
                                name: user.username,
                                email: user.email,
                                username: user.username,
                            };
                        } else {
                            throw new Error("Incorrect password");
                        }
                    } else {
                        throw new Error("User not found");
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
                token.name = user.name;
                token.email = user.email;
                token.username = user.username;
                token.id = user.id; 
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.username = token.username;
            }
            return session;
        },
    },

})
// http://localhost:3000/api/auth/callback/google