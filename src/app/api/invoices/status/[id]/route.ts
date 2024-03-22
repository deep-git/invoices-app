import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";

export async function GET(request: Request, { params }: { params: { id: string }}) {
    const session = await getServerSession();

    try {  
        // validate email and password
        const invoiceID = "#" + params.id;

        const getId = await sql`
            SELECT id FROM users WHERE email=${session?.user?.email}
        `;

        const specificId = getId.rows[0].id;

        const getInvoice_ID = await sql`
            SELECT invoice_id FROM invoices WHERE user_id=${specificId}
        `;

        const specificInvoiceID = getInvoice_ID.rows[0].invoice_id

        const response = await sql`
            SELECT status FROM invoices WHERE invoice_id=${specificInvoiceID}
        `

        return NextResponse.json({response})
        
    } catch (error) {
        console.log({ error });
    }

    return NextResponse.json({ message: "Success" })
}

export async function PUT(request: Request, { params }: { params: { id: string }}) {
    try {
        // validate email and password
        const invoiceUpdateStatus = await request.json();
        const invoiceID = "#" + params.id;

        let invoiceChange = "";
        
        if (invoiceUpdateStatus === "paid") {
            invoiceChange = "pending";
        } else {
            invoiceChange = "paid";
        }

        const response = await sql`
            UPDATE invoices SET status = ${invoiceChange} WHERE invoice_id = ${invoiceID} 
        `;

        return NextResponse.json({response})
        
    } catch (error) {
        console.log({ error });
    }

    return NextResponse.json({ message: "Success" })
}