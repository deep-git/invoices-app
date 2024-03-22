import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";

export async function PUT(request: Request, { params }: { params: { id: string }}) {
    const session = await getServerSession();
    
    try {
        const { fromStreetAddress, fromCity, fromPostCode, fromCountry, clientName, clientEmail, toStreetAddress, toCity, toPostCode, toCountry, invoiceDate, paymentTerms, paymentDue, projectDescription, items, status } = await request.json();

        const invoiceID = "#" + params.id;

        const getId = await sql`
            SELECT id FROM users WHERE email=${session?.user?.email}
        `;

        const specificId = getId.rows[0].id;

        let totalCostInvoice = 0;
        const responseIds = await sql`
            SELECT item_id from invoice_items WHERE invoice_id = ${invoiceID}
        `

        const currentItemIds = responseIds.rows;
        let itemIdsArray = [];
        for(let i = 0; i < currentItemIds.length; i++) {
            itemIdsArray.push(currentItemIds[i].item_id);
        }

        for(let item = 0; item < items.length; item++) {
                if (!itemIdsArray.includes(items[item].item_id)) {
                    const responseItems = await sql`
                        INSERT INTO invoice_items (invoice_id, item_id, item_name, quantity, price, total)
                        VALUES (${invoiceID}, ${items[item].item_id}, ${items[item].item_name}, ${items[item].quantity}, ${items[item].price}, ${items[item].total})
                    `;
                }

            const responseItems = await sql`
                UPDATE invoice_items SET item_name = ${items[item].item_name}, quantity = ${items[item].quantity}, price = ${items[item].price}, total = ${items[item].total} WHERE item_id = ${items[item].item_id}
            `;

            totalCostInvoice = totalCostInvoice + parseFloat(items[item].total);
        }

        const response = await sql`
            UPDATE invoices SET fromStreetAddress = ${fromStreetAddress}, fromCity = ${fromCity}, fromPostCode = ${fromPostCode}, fromCountry = ${fromCountry}, clientName = ${clientName}, clientEmail = ${clientEmail}, toStreetAddress = ${toStreetAddress}, toCity = ${toCity}, toPostCode = ${toPostCode}, toCountry = ${toCountry}, paymentTerms = ${paymentTerms}, paymentDue = ${paymentDue}, projectDescription = ${projectDescription}, totalcost_invoice = ${totalCostInvoice} WHERE invoice_id = ${invoiceID}
        `;
        
    } catch (error) {
        console.log({ error });
    }

    return NextResponse.json({ message: "Success" })
}