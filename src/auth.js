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
/*
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialProvider from "next-auth/providers/credentials";

import User from "./model/user-model";
import bcrypt from 'bcrypt';

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialProvider({
            async authorize(credentials) {
                if (!credentials) return null;
                const user = await User.findOne({ email: credentials.email }).select("+password");
                if (user && (await bcrypt.compare(credentials.password, user.password))) {
                    return {
                        id: user._id.toString(),
                        name: user.username,
                        email: user.email,
                        username: user.username,
                    };
                }
                throw new Error("Invalid credentials");
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            try {
                if (account.provider === "google" || account.provider === "github") {
                    const existingUser = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        await User.create({
                            name: user.name,
                            email: user.email,
                            provider: account.provider,
                            token: account.access_token,
                        });
                    } else {
                        existingUser.token = account.access_token;
                        await existingUser.save();
                    }
                }
                return true;
            } catch (error) {
                console.error("Error during signIn callback:", error);
                return false;
            }
        },
        async jwt({ token, user, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.username = user.username;
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
});
*/
/*
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        provider: { type: String },
        token: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
*/