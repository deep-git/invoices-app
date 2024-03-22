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

export async function DELETE(request: Request) {
    const session = await getServerSession();
    
    try {
        const getId = await sql`
            SELECT id FROM users WHERE email=${session?.user?.email}
        `;

        const specificId = getId.rows[0].id;

        const responseGetInvoices = await sql`
            SELECT invoice_id FROM invoices WHERE user_id=${specificId}
        `;

        const invoiceIds = responseGetInvoices.rows;

        for (let i = 0; i < invoiceIds.length; i++) {
            const responseInvoiceItems = await sql`
                DELETE FROM invoice_items WHERE invoice_id=${invoiceIds[i].invoice_id}
            `;
        }

        const responseInvoices = await sql`
            DELETE FROM invoices WHERE user_id=${specificId}
        `;

        const response = await sql`
            DELETE FROM users WHERE id=${specificId}
        `;

        console.log(responseGetInvoices);
        
        return NextResponse.json({response})
        
    } catch (error) {
        console.log({ error });
    }

    return NextResponse.json({ message: "Success" })
}