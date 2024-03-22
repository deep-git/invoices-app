import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
    const session = await getServerSession();
    
    try {
        const { fromStreetAddress, fromCity, fromPostCode, fromCountry, clientName, clientEmail, toStreetAddress, toCity, toPostCode, toCountry, invoiceDate, paymentTerms, paymentDue, projectDescription, items, status } = await request.json();

        const getId = await sql`
            SELECT id FROM users WHERE email=${session?.user?.email}
        `;

        const specificId = getId.rows[0].id;

        let InvoiceId = "#"
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let i = 0; i < 2; i++) {
            InvoiceId += characters.charAt(Math.floor(Math.random() * characters.length))
        }

        for (let i = 0; i < 4; i++) {
            let num = Math.floor(Math.random() * 10);
            InvoiceId = InvoiceId + num.toString();
        }

        let totalCostInvoice = 0;

        for(let item = 0; item < items.length; item++) {
            const responseItems = await sql`
                INSERT INTO invoice_items (invoice_id, item_id, item_name, quantity, price, total)
                VALUES (${InvoiceId}, ${items[item].item_id}, ${items[item].item_name}, ${items[item].quantity}, ${items[item].price}, ${items[item].total})
            `;
            totalCostInvoice = totalCostInvoice + items[item].total;
        }

        const response = await sql`
            INSERT INTO invoices (invoice_id, user_id, fromstreetaddress, fromcity, frompostcode, fromcountry, clientname, clientemail, tostreetaddress, tocity, topostcode, tocountry, invoicedate, paymentterms, paymentdue, projectdescription, totalcost_invoice, status)
            VALUES (${InvoiceId}, ${specificId}, ${fromStreetAddress}, ${fromCity}, ${fromPostCode}, ${fromCountry}, ${clientName}, ${clientEmail}, ${toStreetAddress}, ${toCity}, ${toPostCode}, ${toCountry}, ${invoiceDate}, ${paymentTerms}, ${paymentDue}, ${projectDescription}, ${totalCostInvoice.toString()}, ${status})
        `;
        
    } catch (error) {
        console.log({ error });
    }

    return NextResponse.json({ message: "Success" })
}