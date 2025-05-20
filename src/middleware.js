import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/home"];
const restrictedWhenAuthenticated = ["/signin", "/signup", "/"];

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    const { pathname } = req.nextUrl;

    if (protectedRoutes.includes(pathname)) {
        if (!token) {
            return NextResponse.redirect(new URL("/signin", req.url));
        }
    }

    if (restrictedWhenAuthenticated.includes(pathname)) {
        if (token) {
            return NextResponse.redirect(new URL("/home", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/home",
        "/signin",
        "/signup",
        "/",
    ],
};


/*
const protectedRoutes = ["/home", "/about", "/project", "/products"];
const restrictedWhenAuthenticated = ["/signin", "/signup", "/"];

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Check if pathname starts with any protected route
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        if (!token) {
            return NextResponse.redirect(new URL("/signin", req.url));
        }
    }

    // Check if pathname matches any restricted route
    if (restrictedWhenAuthenticated.includes(pathname)) {
        if (token) {
            return NextResponse.redirect(new URL("/home", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        ...protectedRoutes.map((route) => `${route}/:path*`), // Supports nested paths for protected routes
        ...restrictedWhenAuthenticated,
    ],
};
*/