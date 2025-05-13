'use client';
import SocialMediaAuth from "./SocialMedia";
import { doCredentialLogin } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function SignInForm () {
    const [error, setError] = useState("");
    const router = useRouter();
    async function HandleSignInForm (event) {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const response = await doCredentialLogin(formData);
            if(!!response.error) {
               setError(response.error.message); 
            } else {
                router.push('/home')
            }
        } catch (error) {
            throw new Error(error);
        }
    }
    return (
        <>
            <div>{error}</div>
            <form onSubmit={HandleSignInForm}>
                <label>Username</label>
                <input type="text" name="username" id="username" placeholder="username" />
                <label>Useremail</label>
                <input type="email" name="email" id="email" placeholder="email" />
                <label>Password</label>
                <input type="password" name="password" id="password" placeholder="password" />
                <input type="submit" value="user signin" />
            </form>
            <SocialMediaAuth />
        </>
    );
}