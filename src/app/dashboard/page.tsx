"use client";

import React, { useEffect, useState } from 'react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { MdKeyboardArrowRight } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaPlus } from "react-icons/fa";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import dateFormat from "dateformat";
import { Invoices } from '../definitions';
import { CircularProgress } from '@mui/material';

const fetchAllInvoices = async () => {
  const response = await fetch('/api/invoices');
  const data = await response.json();

  return data.response.rows;
}

const Dashboard = () => {

  const [invoices, setInvoices] = useState<Array<Invoices>>([]);
  const [invoiceStatus, setInvoiceStatus] = useState<"all" | "pending" | "paid">();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchAll = async() => {
      const invoicesAll = await fetchAllInvoices();
      setInvoices(invoicesAll);
      setLoading(false);
    }

    fetchAll();
  }, []);

  function handleInvoiceView(e: any) {
    setInvoiceStatus(e);
  }

  return (
    <MaxWidthWrapper>
      {isLoading ? (
        <div className="w-full min-h-screen flex justify-center items-center"><CircularProgress/></div>
      ) : (
        <div className="bg-primary w-full text-card pt-20 mb-40">
        <div className="flex w-full justify-between items-center flex-wrap">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl lg:text-4xl font-semibold">Invoices</h1>
            <span className="hidden lg:flex">There are {invoices.length} total invoices</span>
            <span className="flex lg:hidden">{invoices.length}invoices</span>
          </div>

          <div className="flex gap-2 lg:gap-10 justify-center items-center">
            <div className="w-20 lg:w-40">
              <Select onValueChange={(e) => handleInvoiceView(e)}>
                <SelectTrigger className="bg-primary">
                  <SelectValue placeholder="Filter"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Link href="/dashboard/create">
              <div className="flex justify-center items-center gap-4 h-max p-2 bg-[#7c5df9] rounded-[25px] hover:bg-[#6c4fe2] transition-all duration-100">
                <div className="bg-white p-2 rounded-full">
                  <FaPlus className="text-[#7c5df9]"/>
                </div>
                <span className="pr-2 text-white flex gap-1">New <span className="hidden lg:flex">Invoice</span></span>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="w-full mt-10">
          {invoices && invoices.filter((invoice: Invoices) => {
            if (invoiceStatus === undefined) {
              return invoice;
            } else if (invoiceStatus === "all") {
              return invoice;
            } else {
              return invoice.status === invoiceStatus;
            }
          }).map((invoice: Invoices) => (
            <div key={invoice.invoice_id} className="justify-around lg:justify-between group flex w-full px-4 lg:px-10 py-6 mb-5 bg-invoice_card_foreground rounded-lg items-center hover:bg-invoice_card_hover_foreground transition-all duration-100">
              <div className="hidden lg:flex justify-between w-full items-center">
                <span className="flex-1 text-lg"><span className="text-[#7c5df9]">{invoice.invoice_id.substring(0, 1)}</span>{invoice.invoice_id.substring(1)}</span>
                <span className="flex-1 text-gray-500">Due {dateFormat(invoice.paymentdue, "dS mmm yyyy")}</span>
                <span className="flex-1 text-gray-500">{invoice.clientname}</span>
                <span className="flex-1 text-2xl font-semibold">$ {parseFloat(invoice.totalcost_invoice).toFixed(2)}</span>
              </div>

              <div className="flex lg:hidden">
                <div className="flex flex-col">
                  <span className="flex-1 text-lg"><span className="text-[#7c5df9]">{invoice.invoice_id.substring(0, 1)}</span>{invoice.invoice_id.substring(1)}</span>
                  <span className="flex-1 text-gray-500 mt-3">{invoice.invoicedate}</span>
                  <span className="flex-1 text-2xl font-semibold">$ {parseFloat(invoice.totalcost_invoice).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row">
              <span className="flex lg:hidden flex-1 text-gray-500 mb-3">{invoice.clientname}</span>
              <div className="flex flex-row gap-1 lg:gap-4 items-center">
              
                <div className={cn("w-28 px-3 py-3 flex gap-2 justify-center items-center rounded-lg font-semibold tracking-wide", {
                  "bg-orange-500/10 text-orange-500": invoice.status === "pending",
                  "bg-green-500/10 text-green-500": invoice.status === "paid"
                })}>
                  <div className={cn("w-2 h-2 rounded-full", {
                    "bg-orange-500": invoice.status === "pending",
                    "bg-green-500": invoice.status === "paid"
                  })}></div>
                  <div>
                    {invoice.status.substring(0, 1).toUpperCase()}
                    {invoice.status.substring(1)}
                  </div>
                </div>

                <Link href={{ pathname: `/dashboard/${invoice.invoice_id.substring(1)}` }} className="flex justify-center items-center h-max p-2 rounded-full group-hover:translate-x-2 hover:bg-purple_hover transition-all duration-100">
                  <MdKeyboardArrowRight className="w-6 h-6 text-[#7c5df9]"/>
                </Link>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
      
    </MaxWidthWrapper>
  )
}

export default Dashboard;