import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";

export async function GET(request: Request, { params }: { params: { id: string }}) {
    try {
        const session = await getServerSession();

        const invoiceID = "#" + params.id;

        const response = await sql`
            SELECT * FROM invoices WHERE invoice_id=${invoiceID}
        `;

        return NextResponse.json({response})
        
    } catch (error) {
        console.log({ error });
    }

    return NextResponse.json({ message: "Success" })
}

export async function DELETE(request: Request, { params }: { params: { id: string }}) {
    try {
        const session = await getServerSession();

        const invoiceID = "#" + params.id;

        const responseItems = await sql`
            DELETE FROM invoice_items WHERE invoice_id=${invoiceID}
        `;

        const response = await sql`
            DELETE FROM invoices WHERE invoice_id=${invoiceID}
        `;

        return NextResponse.json({response})
        
    } catch (error) {
        console.log({ error });
    }

    return NextResponse.json({ message: "Success" })
}