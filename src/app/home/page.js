import { auth } from "@/auth";
import LogOutButton from "@/components/Logout";
import Image from "next/image";
import { redirect } from "next/navigation";
export default async function HomePage () {
    const session = await auth();
    if(!session?.user) redirect('/signin');
    return (
        <>
            <div>
                <h1>{session?.user?.name}</h1>
                <Image 
                    src={session?.user?.image} 
                    alt={session?.user?.name} 
                    width={100}
                    height={100}    
                />
                <LogOutButton />
            </div>
        </>
    );
}