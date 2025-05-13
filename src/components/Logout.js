import { doLogout } from "@/app/actions";
export default function LogOutButton () {
    return (
        <>
            <form action={doLogout}>
                <button type="submit">Log Out User</button>
            </form>
        </>
    );
}