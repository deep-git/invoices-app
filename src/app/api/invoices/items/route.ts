import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
    const session = await getServerSession();
    
    try {

        const invoiceID = request?.body;

        const getId = await sql`
            SELECT id FROM users WHERE email=${session?.user?.email}
        `;

        const specificId = getId.rows[0].id;

        const getInvoice_ID = await sql`
            SELECT invoice_id FROM invoices WHERE user_id=${specificId}
        `;

        const specificInvoiceID = getInvoice_ID.rows[0].invoice_id

        const response = await sql`
            SELECT * FROM invoice_items WHERE invoice_id=${specificInvoiceID}
        `

        return NextResponse.json({response})
        
    } catch (error) {
        console.log({ error });
    }

    return NextResponse.json({ message: "Success" })
}