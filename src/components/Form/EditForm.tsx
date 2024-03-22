"use client";

import React, { useEffect, useRef, useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FaTrashAlt } from "react-icons/fa";
import { v4 as uuid } from "uuid";
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { AddItems, Invoices } from '@/app/definitions';

const formSchema = z.object({
    fromStreetAddress: z.string().min(3).max(50),
    fromCity: z.string().min(3).max(50),
    fromPostCode: z.string().refine((value) => /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(value ?? ""), "Invalid post code entry"),
    fromCountry: z.string().min(3).max(50),
    clientName: z.string().min(3),
    clientEmail: z.string().email(),
    toStreetAddress: z.string().min(3).max(50),
    toCity: z.string().min(3).max(50),
    toPostCode: z.string().refine((value) => /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(value ?? ""), "Invalid post code entry"),
    toCountry: z.string().min(3).max(50),
    invoiceDate: z.string(),
    paymentTerms: z.enum(["net_seven_days", "net_thirty_days"]),
    projectDescription: z.string(),
});

const currentDate = new Date().toLocaleDateString('en-CA').toString();

const saveDeleteItem = async(itemId: string) => {
    const response = await fetch(`/api/invoices/items/${itemId}`, {
        method: "DELETE"
    })
}

const editInvoice = async(values: z.infer<typeof formSchema>, invoiceID: string, dateDue: Date, invoiceItems: AddItems[]) => {
    const response = await fetch(`/api/invoices/edit/${invoiceID}`, {
        method: 'PUT',
        body: JSON.stringify({
            fromStreetAddress: values.fromStreetAddress,
            fromCity: values.fromCity,
            fromPostCode: values.fromPostCode,
            fromCountry: values.fromCountry,
            clientName: values.clientName,
            clientEmail: values.clientEmail,
            toStreetAddress: values.toStreetAddress,
            toCity: values.toCity,
            toPostCode: values.toPostCode,
            toCountry: values.toCountry,
            invoiceDate: values.invoiceDate,
            paymentTerms: values.paymentTerms,
            paymentDue: dateDue,
            projectDescription: values.projectDescription,
            items: invoiceItems,
        }),
    });
}

const EditForm = ({ handleEditInvoice, invoiceID, invoices, items }: { 
    handleEditInvoice: () => void, 
    invoiceID: string, 
    invoices: Invoices | undefined,
    items: AddItems[]
}) => {
    const [invoiceItems, setInvoiceItems] = useState<Array<AddItems>>(items);
    const [tempInvoiceItems, setTempInvoiceItems] = useState<Array<AddItems>>(items);
    const router = useRouter();
    const [emptyInput, setEmptyInput] = useState<Boolean>(false);
    const [selectDelete, setSelectDelete] = useState<Boolean>(false);
    const [oldDelete, setOldDelete] = useState<Array<AddItems>>(items);

    const [edit, setEdit] = useState<Boolean>(false);
    const editRef = useRef<HTMLInputElement>(null);
    const [forDelete, setForDelete] = useState<Array<string>>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fromStreetAddress: invoices?.fromstreetaddress,
            fromCity: invoices?.fromcity,
            fromPostCode: invoices?.frompostcode,
            fromCountry: invoices?.fromcountry,
            clientName: invoices?.clientname,
            clientEmail: invoices?.clientemail,
            toStreetAddress: invoices?.tostreetaddress,
            toCity: invoices?.tocity,
            toPostCode: invoices?.topostcode,
            toCountry: invoices?.tocountry,
            invoiceDate: currentDate,
            paymentTerms: "net_seven_days",
            projectDescription: invoices?.projectdescription,
        }
    })

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        if (emptyInput === false) {
            let paymentTermDays = 0;
            let date = new Date();
            if (values.paymentTerms === "net_seven_days") {
                paymentTermDays = 7;
                date.setDate(date.getDate() + paymentTermDays);
            } else if (values.paymentTerms === "net_thirty_days") {
                paymentTermDays = 30;
                date.setDate(date.getDate() + paymentTermDays);
            }

            let dateDue = date;

            const dataEdit = await editInvoice(values, invoiceID, dateDue, invoiceItems);
        }

        if (forDelete.length !== 0) {
            for(let i = 0; i < forDelete.length; i++) {
                const dataDelete = await saveDeleteItem(forDelete[i]);
            }
        }

        handleEditInvoice();
    }

    function handleAddItem(e: any) {
        e.preventDefault();
        const unique_id = uuid();
        const small_id = unique_id.slice(0, 8);
        const totalItem: {
            item_id: string,
            item_name: string,
            quantity: number,
            price: number,
            total: number
        } = {
            item_id: small_id,
            item_name: "",
            quantity: 0,
            price: 0,
            total: 0,
        };
        
        setInvoiceItems((prev => [...prev, totalItem]));
    }

    async function deleteItem(itemId: string) {
        let checkIfInPreviousItems = false;

        for(let i = 0; i < tempInvoiceItems.length; i++) {
            if (tempInvoiceItems[i].item_id === itemId) {
                checkIfInPreviousItems = true;
            }
        }

        if (checkIfInPreviousItems === true) {
            if (forDelete.includes(itemId)) {
                const editDelete = forDelete.filter((item) => item !== itemId);
                setForDelete(editDelete);
            } else {
                setForDelete(prev => [...prev, itemId]);
            }
        } else {
            const checkEdits = invoiceItems.filter((item) => item.item_id !== itemId);
            setInvoiceItems(checkEdits);
        }
    }

    function handleChangeItem(e: any, itemId: string) {
        const { name, value } = e.target;

        const editItems = invoiceItems.map((item) => item.item_id === itemId && name ? { ...item, [name]: value } : item);

        const totalCost_Items = editItems.map((item) => item.item_id === itemId ? { ...item, ["total"]: item.quantity * item.price } : item);
        setInvoiceItems(totalCost_Items);
    }
    
  return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5 mb-20">
                <div className="flex flex-col">
                    <h3 className="text-[#7c5df9] font-semibold">Bill From</h3>
                    <div className="mt-5">
                        <FormField control={form.control} name="fromStreetAddress" render={({field}) => {
                            return <FormItem>
                                <FormLabel className="text-slate-500">Street Address</FormLabel>
                                <FormControl>
                                    <Input className="bg-invoice_card_foreground border-invoice_card_border_foreground" placeholder="Street Address" type="text" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        }}/>
                    </div>
                    <div className="flex gap-5 mt-5">
                        <div className="flex-1">
                            <FormField control={form.control} name="fromCity" render={({field}) => {
                                return <FormItem>
                                    <FormLabel className="text-slate-500">City</FormLabel>
                                    <FormControl>
                                        <Input className="bg-invoice_card_foreground border-invoice_card_border_foreground" placeholder="City" type="text" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            }}/>
                        </div>

                        <div className="flex-1">
                            <FormField control={form.control} name="fromPostCode" render={({field}) => {
                                return <FormItem>
                                    <FormLabel className="text-slate-500">Post Code</FormLabel>
                                    <FormControl>
                                        <Input className="bg-invoice_card_foreground border-invoice_card_border_foreground" placeholder="Post Code" type="text" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            }}/>
                        </div>

                        <div className="flex-1">
                            <FormField control={form.control} name="fromCountry" render={({field}) => {
                                return <FormItem>
                                    <FormLabel className="text-slate-500">Country</FormLabel>
                                    <FormControl>
                                        <Input className="bg-invoice_card_foreground border-invoice_card_border_foreground" placeholder="Country" type="text" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            }}/>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col mt-10 gap-5">
                    <h3 className="text-[#7c5df9] font-semibold">Bill To</h3>
                        <FormField control={form.control} name="clientName" render={({field}) => {
                            return <FormItem>
                                <FormLabel className="text-slate-500">Client's Name</FormLabel>
                                <FormControl>
                                    <Input className="bg-invoice_card_foreground border-invoice_card_border_foreground" placeholder="Client's Name" type="text" {...field}/>
                                   </FormControl>
                                <FormMessage/>
                            </FormItem>
                        }}/>

                        <FormField control={form.control} name="clientEmail" render={({field}) => {
                            return <FormItem>
                                <FormLabel className="text-slate-500">Client's Email</FormLabel>
                                <FormControl>
                                    <Input className="bg-invoice_card_foreground border-invoice_card_border_foreground" placeholder="Client's Email" type="text" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        }}/>

                        <FormField control={form.control} name="toStreetAddress" render={({field}) => {
                            return <FormItem>
                                <FormLabel className="text-slate-500">Street Address</FormLabel>
                                <FormControl>
                                    <Input className="bg-invoice_card_foreground border-invoice_card_border_foreground" placeholder="Street Address" type="text" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        }}/>

                        <div className="flex gap-5">
                            <div className="flex-1">
                                <FormField control={form.control} name="toCity" render={({field}) => {
                                    return <FormItem>
                                        <FormLabel className="text-slate-500">City</FormLabel>
                                        <FormControl>
                                            <Input className="bg-invoice_card_foreground border-invoice_card_border_foreground" placeholder="City" type="text" {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                }}/>
                            </div>

                            <div className="flex-1">
                                <FormField control={form.control} name="toPostCode" render={({field}) => {
                                    return <FormItem>
                                        <FormLabel className="text-slate-500">Post Code</FormLabel>
                                        <FormControl>
                                            <Input className="bg-invoice_card_foreground border-invoice_card_border_foreground" placeholder="Post Code" type="text" {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                }}/>
                            </div>

                            <div className="flex-1">
                                <FormField control={form.control} name="toCountry" render={({field}) => {
                                    return <FormItem>
                                        <FormLabel className="text-slate-500">Country</FormLabel>
                                        <FormControl>
                                            <Input className="bg-invoice_card_foreground border-invoice_card_border_foreground" placeholder="Country" type="text" {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                }}/>
                            </div>
                    </div>
                </div>

                <div className="flex flex-col gap-5 mt-10">
                    <div className="flex gap-5">
                        <div className="flex-1">
                            <FormField control={form.control} name="invoiceDate" render={({field}) => {
                                return <FormItem>
                                    <FormLabel className="text-gray-400">Invoice Date</FormLabel>
                                    <FormControl>
                                        <Input className="bg-invoice_card_foreground border-invoice_card_border_foreground" disabled={true} type="date" value={currentDate}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            }}/>
                        </div>

                        <div className="flex-1 text-card">
                            <FormField control={form.control} name="paymentTerms" render={({field}) => {
                                return <FormItem className="flex flex-col gap-2">
                                    <FormLabel className="text-slate-500">Payment Terms</FormLabel>
                                    <FormControl>
                                        <select className="bg-invoice_card_foreground text-card px-3 py-3 text-sm rounded-lg" defaultValue={invoices?.paymentterms} onChange={field.onChange}>
                                            <option value="net_seven_days">Net 7 Days</option>
                                            <option value="net_thirty_days">Net 30 Days</option>
                                        </select>
                                     
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            }}/>
                         </div>
                    </div>

                    <FormField control={form.control} name="projectDescription" render={({field}) => {
                        return <FormItem>
                            <FormLabel className="text-slate-500">Project Description</FormLabel>
                            <FormControl>
                                <Input className="bg-invoice_card_foreground border-invoice_card_border_foreground" placeholder="Project Description..." type="text" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    }}/>
                </div>

                <div className="mt-5">
                    <h3 className="text-xl text-gray-400 font-semibold">Item List</h3>
                    <table className="mt-5 w-full">
                        <thead className="text-left">
                            <tr>
                                <th>Item Name</th>
                                <th>Qty.</th>
                                <th>Price</th>
                                <th>Total</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoiceItems && invoiceItems.map(({item_id, item_name, quantity, price, total}) => (
                                <tr key={item_id}>
                                    <td><Input name="item_name" onChange={(e) => handleChangeItem(e, item_id)} className="bg-invoice_card_foreground border-invoice_card_border_foreground" value={item_name} placeholder="Item Name..." type="text"/></td>
                                    
                                    <td><Input name="quantity" onChange={(e) => {
                                        handleChangeItem(e, item_id);
                                    }} className="bg-invoice_card_foreground border-invoice_card_border_foreground" value={quantity} placeholder="Quantity" type="number"/></td>

                                    <td><Input name="price" onChange={(e) => {
                                        handleChangeItem(e, item_id);
                                    }} className="bg-invoice_card_foreground border-invoice_card_border_foreground" value={price} placeholder="Price" type="number"/></td>

                                    <td><Input name="total" disabled={true} value={total} onChange={(e) => handleChangeItem(e, item_id)} className="bg-invoice_card_foreground border-invoice_card_border_foreground" placeholder="Total" type="number"/></td>

                                    <td onClick={() => {
                                        deleteItem(item_id);
                                    }} className={cn("flex justify-center cursor-pointer items-center h-10", {
                                        "text-red-700 bg-red-200": forDelete.includes(item_id) === true,
                                        "text-[#3a3c5e] bg-none": forDelete.includes(item_id) === false
                                    })}><FaTrashAlt /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Button onClick={(e) => handleAddItem(e)} className="text-white bg-[#7c5df9] hover:bg-[#6649da] mt-5">Add Item</Button>
                </div>

                <div className="flex w-full mt-5 gap-5 justify-end">
                    <Button onClick={() => handleEditInvoice()} className="w-auto px-10 text-md bg-invoice_card_foreground hover:bg-invoice_card_border_foreground">Cancel</Button>
                    <Button type="submit" className="w-auto px-10 text-md text-white bg-[#7c5df9] hover:bg-[#6649da]">Save</Button>
                </div>
            </form>
        </Form>
  )
}

export default EditForm;