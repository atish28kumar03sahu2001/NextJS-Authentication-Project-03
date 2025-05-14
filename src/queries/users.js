import User from "@/model/user-model";

export async function createUser(user) {
    try {
        const createdUser = await User.create(user);
        return createdUser;
    } catch (error) {
        throw new Error(e);
    }
}