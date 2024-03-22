import InvoiceForm from '@/components/Form/InvoiceForm';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Link from 'next/link';
import React from 'react';
import { IoMdArrowRoundBack } from "react-icons/io";

const CreateInvoice = () => {
  return (
    <MaxWidthWrapper>
        <div className="text-card pt-20">
          <div className="w-max">
            <Link href="/dashboard" className="w-16 ">
              <span className="flex items-center gap-1 w-max px-3 py-2 rounded-xl bg-purple_hover text-[#7c5df9] font-bold"><IoMdArrowRoundBack />Back</span>
            </Link>
          </div>
          <h2 className="text-3xl mt-5">Create Invoice</h2>
          <div className="mt-10">
              <InvoiceForm/>
          </div>
        </div>
    </MaxWidthWrapper>
  )
}

export default CreateInvoice;