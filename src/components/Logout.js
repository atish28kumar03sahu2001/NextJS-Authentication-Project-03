'use client';
import { doLogout } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function LogOutButton() {
    const router = useRouter();

    async function handleLogout() {
        const result = await doLogout();
        if (result.success) {
            router.push("/"); // Redirect to the desired route
        } else {
            console.error(result.error);
            alert("Logout failed. Please try again.");
        }
    }

    return <button onClick={handleLogout}>Log Out</button>;
}
