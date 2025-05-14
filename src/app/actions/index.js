'use server';
import { signIn, signOut } from "@/auth";
export async function doSocialLogin(formData) {
    const action = formData.get('action');
    await signIn(action,{redirectTo: '/home'});
}
export async function doLogout() {
    try {
        await signOut({ redirect: false });
        return { success: true };
    } catch (error) {
        console.error("Logout error:", error);
        return { success: false, error: error.message };
    }
}

export async function doCredentialLogin(formData) {
    try {
        const response = await signIn("credentials",{
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false
        })
        return response;
    } catch (error) {
        throw new Error(error);
    }
}