import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { compare, hash } from "bcrypt";

export async function PUT(request: Request) {
    try {
        const session = await getServerSession();
        // validate email and password
        const {images} = await request.json();

        const getId = await sql`
            SELECT id FROM users WHERE email=${session?.user?.email}
        `;

        const response = await sql`
            UPDATE users SET image = ${images} WHERE id=${getId.rows[0].id}
        `;

        return NextResponse.json({response})
        
    } catch (error) {
        console.log({ error });
    }

    return NextResponse.json({ message: "Success" })
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession();

        const getId = await sql`
            SELECT id FROM users WHERE email=${session?.user?.email}
        `;

        const specificId = getId.rows[0].id;

        const response = await sql`
            SELECT image FROM users WHERE id=${specificId}
        `;

        return NextResponse.json({response})
        
    } catch (error) {
        console.log({ error });
    }

    return NextResponse.json({ message: "Success" })
}