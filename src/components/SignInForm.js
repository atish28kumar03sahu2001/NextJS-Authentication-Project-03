import { doSocialLogin } from "@/app/actions";
export default function SignInForm () {
    return (
        <>
            <form action={doSocialLogin}>
                <button type="submit" name="action" value="google">Google</button>
                <button type="submit" name="action" value="github">GitHub</button>
            </form>
        </>
    );
}