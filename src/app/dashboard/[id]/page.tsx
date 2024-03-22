"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { TiArrowRightThick } from "react-icons/ti";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import EditForm from "@/components/Form/EditForm";
import dateFormat from "dateformat";
import { AddItems, InvoiceTerms, Invoices } from "@/app/definitions";
import useSWR from "swr";

  const fetchSpecificInvoice = async(invoiceID: string) => {
    const response = await fetch(`/api/invoices/${invoiceID}`, {
        method: "GET"
    });
    const data = await response.json();

    return data.response.rows[0];
  }

  const fetchInvoiceItems = async(invoiceID: string) => {
    const response = await fetch(`/api/invoices/items/${invoiceID}`, {
        method: "GET"
    });
    const data = await response.json();

    return data.response.rows;
  }

  const deleteSpecificInvoice = async(invoiceID: string) => {
    const response = await fetch(`/api/invoices/${invoiceID}`, {
        method: "DELETE"
    })
  }

  const updateStatusData = async(invoiceID: string, statusChange: Boolean) => {
    const response = await fetch(`/api/invoices/status/${invoiceID}`, {
        method: "PUT",
        body: JSON.stringify(statusChange)
    });
  }

  const fetcher = (url: string) => fetch(url).then((res) => res.json()).then((data) => data.response.rows[0].status);

const SpecificInvoice = ({ params }: { params: InvoiceTerms }) => {

    const [invoices, setInvoices] = useState<Invoices>();
    const [items, setItems] = useState<Array<AddItems>>([]);

    const [deleteInvoiceValue, setDeleteInvoiceValue] = useState<string>("");
    const [edit, setEdit] = useState<Boolean>(false);
    const editRef = useRef<HTMLInputElement>(null);
    const [isLoading, setLoading] = useState<boolean>(false);
    
    const invoiceID = params?.id;

    const router = useRouter();

    const { data } = useSWR(`/api/invoices/status/${invoiceID}`, fetcher);

    const [statusChange, setStatusChange] = useState<Boolean>(data);

    const totalCost: string = invoices?.totalcost_invoice!;

    useEffect(() => {
        let handler = (e: any) => {
          if (editRef.current && !editRef.current.contains(e.target)) {
            setEdit(false);
          }
        }
    
        document.addEventListener("mousedown", handler);
    
        return() => {
            document.removeEventListener("mousedown", handler);
        }
      }, [editRef]);

    useEffect(() => {
        const fetchInvoice = async() => {
            const data = await fetchSpecificInvoice(invoiceID);
            setInvoices(data);
            setStatusChange(data.status);
        }

        fetchInvoice();
    }, [edit, statusChange]);

    useEffect(() => {
        const fetchItems = async() => {
            const data = await fetchInvoiceItems(invoiceID);
            setItems(data);
        }

        fetchItems();
    }, [edit])

    async function handleDeleteInvoice() {
        if (deleteInvoiceValue === `#${invoiceID}`) {
            const response = await deleteSpecificInvoice(invoiceID);
            router.push("/dashboard");
        }
    }

    if (edit) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "unset";
    }

    function handleEditInvoice() {
        setEdit(false);
        document.body.style.overflow = "unset";
    }

    async function handleStatusChange() {
        setLoading(true);
        setStatusChange(prev => !prev);

        const statusData = await updateStatusData(invoiceID, statusChange);
        
        setLoading(false);
    }

  return (
    <MaxWidthWrapper>
            <div className={cn("text-card pt-20")}>
            <div className="w-max">
                <Link href="/dashboard">
                    <span className="flex items-center gap-1 w-max px-3 py-2 rounded-xl bg-purple_hover text-[#7c5df9] font-bold"><IoMdArrowRoundBack />Back</span>
                </Link>
            </div>

          <div className="flex flex-wrap justify-between items-center w-full mt-10 px-10 py-5 bg-invoice_card_foreground rounded-lg h-max">
            <h2 className="text-3xl">Invoice <span className="text-[#7c5df9]">#</span>{invoiceID}</h2>

            <div className="flex gap-3 flex-wrap mt-5 sm:mt-0">
                <div>
                    <Button onClick={() => {
                        setEdit(true);
                    }} className="text-white bg-[#2f3250] hover:bg-invoice_card_hover_foreground rounded-[25px] px-6 py-3">Edit</Button>
       
                    {edit && (
                            <div className="absolute top-0 left-0 z-50 w-full h-full bg-[rgba(0,0,0,0.6)]">
                                <div ref={editRef} className="edit_scroll fixed top-0 left-0 lg:left-24 w-full lg:w-max h-full bg-primary lg:rounded-tr-2xl lg:rounded-br-2xl pt-32 lg:pt-10 overflow-y-scroll">
                                    <MaxWidthWrapper className="max-w-screen-sm">
                                        <h2 className="text-3xl">Edit Invoice <span className="text-[#7c5df9]">#{invoiceID}</span></h2>
                                        <div className="mt-10">
                                            <EditForm handleEditInvoice={handleEditInvoice} invoiceID={invoiceID} invoices={invoices} items={items}/>
                                        </div>
                                    </MaxWidthWrapper>
                                </div>
                            </div>
                    )}
                </div>
                <div>
                    <Dialog>
                        <DialogTrigger>
                            <div className="h-10 flex justify-center items-center text-white bg-rose-600 hover:bg-rose-700 px-6 rounded-[25px]">Delete</div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Are you sure you would like to delete this invoice?</DialogTitle>
                            <DialogDescription>This action cannot be undone. To confirm permanently deleting this invoice from our servers, please enter the following:</DialogDescription>
                            <DialogDescription>#{invoiceID}</DialogDescription>

                            <div>
                                <Input id="delete_invoice" value={deleteInvoiceValue} onChange={(e) => setDeleteInvoiceValue(e.target.value)} className={cn("", {
                                    "text-rose-700": deleteInvoiceValue !== `#${invoiceID}`,
                                    "text-green-700": deleteInvoiceValue === `#${invoiceID}`
                                })}/>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button type="submit" onClick={() => handleDeleteInvoice()} variant="destructive">Delete</Button>
                            </DialogFooter>
                        </DialogContent>
        
                    </Dialog>
                    
                </div>
                <div>
                    <Button onClick={() => {
                        handleStatusChange()
                    }} disabled={isLoading} className="text-white bg-[#7c5df9] hover:bg-[#6c4fe2] rounded-[25px] px-6">Mark as {invoices?.status === "pending" ? "paid" : "pending"}</Button>
                </div>
            </div>
          </div>

          <div className={cn("flex justify-center items-center w-full mt-5 px-10 py-5 rounded-lg h-max", {
            "bg-orange-500/20 text-orange-500": invoices?.status === "pending",
            "bg-green-500/20 text-green-500": invoices?.status === "paid"
          })}>
            <span className="text-2xl">{invoices && invoices.status && invoices.status.substring(0, 1).toUpperCase()}{invoices && invoices.status && invoices.status.substring(1)}</span>
          </div>

          <div className="flex flex-col mt-5 mb-20 w-full bg-invoice_card_foreground px-5 lg:px-10 items-center py-10 rounded-lg">
            <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between items-center">
                    <span>From Street Address:</span>
                    <span className="text-right">{invoices?.fromstreetaddress}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>City:</span>
                    <span>{invoices?.fromcity}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Post Code:</span>
                    <span>{invoices?.frompostcode}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Country:</span>
                    <span>{invoices?.fromcountry}</span>
                </div>
            </div>

            <div className="flex flex-wrap mt-10 w-full bg-primary px-3 py-2 justify-center items-center gap-5 lg:gap-10 text-xl">
                <h3 className="text-[#7c5df9]">Sent to</h3>
                <span>{invoices?.clientname}</span>
                <span>{invoices?.clientemail}</span>
            </div>

            <div className="flex flex-col items-center lg:flex-row mt-5 gap-2 lg:gap-5 bg-primary px-3 py-2 rounded-lg flex-wrap">
                <span className="font-semibold"><span className="text-[#7c5df9]">Made</span> {dateFormat(invoices?.invoicedate, "dS mmm yyyy")}</span>
                <TiArrowRightThick className="rotate-90 lg:rotate-0 text-[#7c5df9] z-10"/>
                <span className="font-semibold"><span className="text-[#7c5df9]">Due</span> {dateFormat(invoices?.paymentdue, "dS mmm yyyy")}</span>
            </div>
            

            <div className="flex flex-col mt-10 gap-2 w-full justify-center">
                <div className="flex justify-between items-center">
                    <span>To Street Address:</span>
                    <span className="text-right">{invoices?.tostreetaddress}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>City:</span>
                    <span>{invoices?.tocity}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Post Code:</span>
                    <span>{invoices?.topostcode}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Country:</span>
                    <span>{invoices?.tocountry}</span>
                </div>
            </div>

            <div className="w-full mt-10 bg-invoice_items rounded-xl overflow-hidden">
                <div className="w-full px-4 lg:px-10 py-5">
                    <table className="w-full ">
                        <thead>
                            <tr>
                                <td className="text-gray-500 border-r-[1px] px-2 border-r-slate-300 lg:border-none">Item Name</td>
                                <td className="text-gray-500 text-center px-2 lg:text-right border-r-[1px] border-r-slate-300 lg:border-none">QTY.</td>
                                <td className="text-gray-500 text-center px-2 lg:text-right border-r-[1px] border-r-slate-300 lg:border-none">Price</td>
                                <td className="text-gray-500 text-center px-2 lg:text-right">Total</td>
                            </tr>
                        </thead>

                        <tbody>
                            {items && items.map((item) => (
                                <tr key={item.item_id}>
                                    <td className="pt-5 border-r-[1px] px-2 border-r-slate-300 lg:border-none">{item.item_name}</td>
                                    <td className="pt-5 text-center px-2 lg:text-right border-r-[1px] border-r-slate-300 lg:border-none">{item.quantity}</td>
                                    <td className="pt-5 text-center px-2 lg:text-right border-r-[1px] border-r-slate-300 lg:border-none">$ {item.price.toFixed(2)}</td>
                                    <td className="pt-5 text-center px-2 lg:text-right">$ {item.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="w-full bg-black mt-5 h-full px-10 py-5 text-right">
                    <span className="text-4xl text-white">$ {parseFloat(totalCost).toFixed(2)}</span>
                </div>
            </div>
          </div>
        </div>     
    </MaxWidthWrapper>
  )
}

export default SpecificInvoice;