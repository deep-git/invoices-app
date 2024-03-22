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
            SELECT * FROM invoices WHERE user_id=${specificId}
        `;

        return NextResponse.json({response})
        
    } catch (error) {
        console.log({ error });
    }

    return NextResponse.json({ message: "Success" })
}