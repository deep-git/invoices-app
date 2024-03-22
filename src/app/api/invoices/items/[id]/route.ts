import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(request: Request, { params }: { params: { id: string }}) {
    try {
        const invoiceID = "#" + params.id;

        const response = await sql`
            SELECT * FROM invoice_items WHERE invoice_id=${invoiceID}
        `

        return NextResponse.json({response})
        
    } catch (error) {
        console.log({ error });
    }

    return NextResponse.json({ message: "Success" })
}

export async function DELETE(request: Request, { params }: { params: { id: string }}) {
    try {
        const itemId = params.id;

        const response = await sql`
            DELETE FROM invoice_items WHERE item_id=${itemId}
        `;

        return NextResponse.json({response})
        
    } catch (error) {
        console.log({ error });
    }

    return NextResponse.json({ message: "Success" })
}