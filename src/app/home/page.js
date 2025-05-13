import { auth } from "@/auth";
import LogOutButton from "@/components/Logout";
import Image from "next/image";
import { redirect } from "next/navigation";
export default async function HomePage () {
    const session = await auth();
    if(!session?.user) redirect('/signin');
    console.log(session?.user);
    return (
        <>
            <div>
                {
                    session?.user?.image && session?.user?.name ? 
                    (
                        <>
                            <h1>{session?.user?.name}</h1>
                            <h1>{session?.user?.email}</h1>
                            <Image 
                                src={session?.user?.image} 
                                alt={session?.user?.name} 
                                width={100}
                                height={100}    
                            />
                        </>
                    ) : 
                    (
                        <>
                            <h1>{session?.user?.email}</h1>
                            <h1>{session?.user?.name}</h1>
                            <h1>{session?.user?.username}</h1>
                        </>
                    )
                }
                
                <LogOutButton />
            </div>
        </>
    );
}
