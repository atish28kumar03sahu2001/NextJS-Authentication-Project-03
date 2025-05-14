'use client';
import SocialMediaAuth from "@/components/SocialMedia";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function SignUpForm() {
    const router = useRouter();
    async function HandleSubmit (event) {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const username = formData.get('username');
            const email = formData.get('email');
            const password = formData.get('password');
            const response = await fetch('/api/register',{
                method: 'POST',
                headers: {"content-type": "application/json",},
                body: JSON.stringify({
                    username, email, password
                })
            })
            response.status === 201 && router.push('/signin');
        } catch (error) {
            console.error(error.message);
        }
    }
    return (
        <>
            <h1>User Sign Up</h1>
            <form onSubmit={HandleSubmit}>
                <label>Username</label>
                <input type="text" name="username" id="username" placeholder="username" />
                <label>Useremail</label>
                <input type="email" name="email" id="email" placeholder="email" />
                <label>Password</label>
                <input type="password" name="password" id="password" placeholder="password" />
                <input type="submit" value="user signup" />
            </form>
            <SocialMediaAuth />
            <Link href={'/signin'}>Already Have An Account</Link>
        </>
    );
}