export interface InvoiceTerms {
    id: string,
}

export interface User {
    firstname: string,
    lastname: string,
    email: string
    image?: string | null
}

export interface AddItems {
    item_id: string,
    item_name: string,
    quantity: number,
    price: number,
    total: number,
}

export interface Invoices {
    fromstreetaddress: string,
    fromcity: string,
    frompostcode: string,
    fromcountry: string,
    clientname: string,
    clientemail: string,
    tostreetaddress: string,
    tocity: string,
    topostcode: string,
    tocountry: string,
    invoicedate: string,
    paymentterms: string,
    paymentdue: string,
    projectdescription: string,
    id: number,
    invoice_id: string,
    user_id: number,
    totalcost_invoice: string,
    status: "pending" | "paid"
  }
