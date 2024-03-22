import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
    try {
        const session = await getServerSession();
        // validate email and password

        const getId = await sql`
            SELECT id FROM users WHERE email=${session?.user?.email}
        `;

        const specificId = getId.rows[0].id;

        const response = await sql`
            SELECT firstname, lastname, email, image FROM users WHERE id=${specificId}
        `;

        return NextResponse.json({response})
        
    } catch (error) {
        console.log({ error });
    }

    return NextResponse.json({ message: "Success" })
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession();
        // validate email and password
        const {firstName, lastName} = await request.json();
        console.log("firstname", firstName);

        const getId = await sql`
            SELECT id FROM users WHERE email=${session?.user?.email}
        `;

        const specificId = getId.rows[0].id;

        const response = await sql`
            UPDATE users SET firstname = ${firstName}, lastname = ${lastName} WHERE id = ${specificId} 
        `;

        return NextResponse.json({response})
        
    } catch (error) {
        console.log({ error });
    }

    return NextResponse.json({ message: "Success" })
}