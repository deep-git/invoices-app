"use client";

import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FaTrashAlt } from "react-icons/fa";
import { v4 as uuid } from "uuid";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { useRouter } from 'next/navigation';
import { AddItems } from '@/app/definitions';

const formSchema: any = z.object({
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

const createInvoice = async(values: z.infer<typeof formSchema>, dateDue: Date, items: AddItems[]) => {
    const response = await fetch(`/api/invoices/create`, {
        method: 'POST',
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
                items: items,
                status: "pending"
            }),
    });
}

const InvoiceForm = () => {
    const [items, setItems] = useState<Array<AddItems>>([]);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fromStreetAddress: "",
            fromCity: "",
            fromPostCode: "",
            fromCountry: "",
            clientName: "",
            clientEmail: "",
            toStreetAddress: "",
            toCity: "",
            toPostCode: "",
            toCountry: "",
            invoiceDate: currentDate,
            paymentTerms: "net_seven_days",
            projectDescription: "",
        }
    })

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
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

        const response = createInvoice(values, dateDue, items);

        router.push("/dashboard");
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
        }

        
        setItems(prev => [...prev, totalItem]);
    }

    function deleteItem(itemId: string) {
        const newItems = items.filter((item) => item.item_id !== itemId);

        setItems(newItems);
    }

    function handleChangeItem(e: any, itemId: string) {
        const { name, value } = e.target;

        const editItems = items.map((item) => item.item_id === itemId && name ? { ...item, [name]: value } : item);

        const totalCost_Items = editItems.map((item) => item.item_id === itemId ? { ...item, ["total"]: item.quantity * item.price } : item);
        
        setItems(totalCost_Items);
    }
    
  return (
    <div>
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
                                return <FormItem>
                                    <FormLabel className="text-slate-500">Payment Terms</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange}>
                                            <SelectTrigger className="bg-primary">
                                                <SelectValue placeholder="Select Term"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="net_seven_days">Net 7 Days</SelectItem>
                                                <SelectItem value="net_thirty_days">Net 30 Days</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                            {items && items.map(({item_id, item_name, quantity, price, total}) => (
                                <tr key={item_id}>
                                    <td><Input name="item_name" onChange={(e) => handleChangeItem(e, item_id)} className="bg-invoice_card_foreground border-invoice_card_border_foreground" value={item_name} placeholder="Item Name..." type="text"/></td>
                                    
                                    <td><Input name="quantity" onChange={(e) => {
                                        handleChangeItem(e, item_id);
                                    }} className="bg-invoice_card_foreground border-invoice_card_border_foreground" value={quantity} placeholder="Quantity" type="number"/></td>

                                    <td><Input name="price" onChange={(e) => {
                                        handleChangeItem(e, item_id);
                                    }} className="bg-invoice_card_foreground border-invoice_card_border_foreground" value={price} placeholder="Price" type="number"/></td>

                                    <td><Input name="total" disabled={true} value={total} onChange={(e) => handleChangeItem(e, item_id)} className="bg-invoice_card_foreground border-invoice_card_border_foreground" placeholder="Total" type="number"/></td>

                                    <td onClick={() => deleteItem(item_id)} className="flex justify-center items-center h-10 text-[#3a3c5e]"><FaTrashAlt /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Button onClick={(e) => handleAddItem(e)} className="text-white bg-[#7c5df9] hover:bg-[#6649da] mt-5">Add Item</Button>
                </div>

                <Button type="submit" className="w-max mt-5 ml-auto px-10 text-md text-white bg-[#7c5df9] hover:bg-[#6649da]">Create Invoice</Button>
            </form>
        </Form>
    </div>
  )
}

export default InvoiceForm;