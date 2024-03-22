import RegisterForm from "@/components/Form/RegisterForm";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowUpNarrowWide, FolderKanban, Pencil, TicketPlus } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {

  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <section className="flex flex-col min-h-screen bg-primary">
      <nav className="flex w-full bg-primary flex-wrap justify-between items-center">
        <div className="w-max">
          <Image src="/logo.png" alt="Invoice logo" width={100} height={100}/>
        </div>

        <div className="flex gap-7 mx-auto md:ml-auto flex-wrap md:mr-10">
          {!session && (
              <Link href="/register">
              <Button className="bg-[#7c5df9] hover:bg-[#6448d6]">Register</Button>
            </Link>
            )}

          {!session && (
            <Link href="/login">
              <Button className="bg-[#7c5df9] hover:bg-[#6448d6]">Login</Button>
            </Link>
          )}
        </div>
      </nav>
      
      <div className="background_designs relative flex-1 flex bg-primary flex-col">
        <div className=" flex flex-col mt-20 items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-[#7c5df9] text-5xl w-full text-center mt-5 sm:text-[5em] md:text-[7em]">Charge-Up</h1>
            <div className="text-[#7552ff] text-left flex gap-2 items-center text-md  md:text-xl max-w-52 sm:max-w-[100%]">
              <span><ArrowUpNarrowWide className="w-7 h-7"/></span>
              <p>Your reliable invoice management application.</p>
            </div>
          </div>
        
          <div className="flex flex-col justify-center items-center gap-10 text-card max-w-52 md:max-w-[70%] lg:max-w-[720px] mt-20">
            <div className="flex flex-1 flex-col border-l-[2px] border-r-[2px] border-[#7552ff] rounded-lg">
              <p className="p-5 text-md lg:text-lg text-card">Manage your invoices on a professional level by seamless addition, removal, and editing of invoices. Our application keeps extensive track of all invoices recorded and ensures that users are updated at all times!</p>
            </div>

            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex flex-1 flex-col border-[2px] border-slate-700 rounded-lg p-5">
                <div className="flex gap-2 justify-center items-center bg-[#7c5df9] bg-opacity-20 text-[#7552ff] p-2 rounded-lg">
                  <TicketPlus />
                  <h1>Add Invoices</h1>
                </div>
                <p className="mt-5">Add any outstanding invoices and their details to keep everything within the same inventory!</p>
              </div>

              <div className="flex flex-1 flex-col border-[2px] border-slate-700 rounded-lg p-5">
                <div className="flex gap-2 justify-center items-center bg-[#7c5df9] bg-opacity-20 text-[#7552ff] p-2 rounded-lg">
                  <Pencil />
                  <h1>Edit Invoices</h1>
                </div>
                <p className="mt-5">Edit invoices as you choose, from their specific detailed information, to the status and deletion. The choices are up to you!</p>
              </div>
          
              <div className="flex flex-1 flex-col border-[2px] border-slate-700 rounded-lg p-5">
                <div className="flex gap-2 justify-center items-center bg-[#7c5df9] bg-opacity-20 text-[#7552ff] p-2 rounded-lg">
                  <FolderKanban />
                  <h1>Manage Invoices</h1>
                </div>
                <p className="mt-5">Keep track of and manage all invoices, to their details and status, all in one place to the convenience of the user!</p>
              </div>
            </div>
        </div>
        </div>
      </div>
        
    </section>
  );
}
