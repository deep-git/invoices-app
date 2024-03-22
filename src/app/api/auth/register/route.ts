import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
    try {
        const { firstName, lastName, email, password, theme } = await request.json();

        // validate email and password

        const hashedPassword = await hash(password, 10);

        const response = await sql`
            INSERT INTO users (firstName, lastName, email, password, theme)
            VALUES (${firstName}, ${lastName}, ${email}, ${hashedPassword}, ${theme})
        `;
    } catch (error) {
        console.log({ error });
    }

    return NextResponse.json({ message: "Success" })
}