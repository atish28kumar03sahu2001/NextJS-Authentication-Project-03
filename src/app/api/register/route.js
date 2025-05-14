import { NextResponse } from "next/server";
import { createUser } from "@/queries/users";
import bcrypt from 'bcrypt';
import connectToDB from "@/database";
export const POST = async (request) => {
    const {username, email, password} = await request.json();

    console.log(username, email, password);

    await connectToDB();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { username, email, password: hashedPassword };

    try {
        await createUser(newUser);
    } catch (error) {
        return new NextResponse(error.message,{
            status: 500,
        });
    }

    return new NextResponse("User Has Been Created!",{
        status: 201,
    });
}