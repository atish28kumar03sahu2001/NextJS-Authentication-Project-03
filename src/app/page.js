import Link from "next/link";

export default function Home () {
    return (
        <>
            <div>
                <h1>Authentication</h1>
                <Link href={'/signin'}>Click Here For Sign In</Link>
            </div>
        </>
    );
}