import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { compare, hash } from "bcrypt";

export async function PUT(request: Request) {
    try {
        const session = await getServerSession();
        // validate email and password
        const {currentPassword, newPassword} = await request.json();

        const getId = await sql`
            SELECT id FROM users WHERE email=${session?.user?.email}
        `;

        const getInfo = await sql`
            SELECT password FROM users WHERE id=${getId.rows[0].id}
        `;

        const specificId = getId.rows[0].id;

        const passwordCorrect = await compare(currentPassword, getInfo.rows[0].password);

        if (passwordCorrect) {
            const newPasswordHash = await hash(newPassword, 10);
            const response = await sql`
                UPDATE users SET password = ${newPasswordHash} WHERE id = ${specificId} 
            `;

            return NextResponse.json({response, message: "Password successfully changed."})

        } else {
            const response = "Entered password is incorrect."
            return NextResponse.json({response, message: "Entered password is incorrect."})
        }
        
    } catch (error) {
        console.log({ error });
    }

    return NextResponse.json({ message: "Success" })
}