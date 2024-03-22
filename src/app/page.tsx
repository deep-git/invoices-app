import RegisterForm from "@/components/Form/RegisterForm";
import { Button, buttonVariants } from "@/components/ui/button";
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
      <nav className="flex w-full bg-primary px-5 py-10 flex-wrap">
        <div className="flex gap-7 mx-auto flex-wrap">
          {!session && (
              <Link href="/register">
              <Button className="bg-purple-600 hover:bg-purple-500">Register</Button>
            </Link>
            )}

          {!session && (
            <Link href="/login">
              <Button className="bg-purple-600 hover:bg-purple-500">Login</Button>
            </Link>
          )}
        </div>
      </nav>
      
      <div className="relative flex-1 flex bg-primary py-10 flex-col justify-center items-center">
        <div className="w-[500px] flex flex-col justify-center items-center">
        <h1 className="text-[#7c5df9] text-5xl w-full text-center">Invoice App</h1>
        <div className="w-max mt-10">
          <Image src="/logo.png" alt="Invoice logo" width={200} height={100}/>
        </div>
        <p className="p-5 text-lg text-card">Manage your invoices on a professional level by seamless addition, removal, and editing of invoices. Our application keeps extensive track of all invoices recorded and ensures that users are updated at all times!</p>
      </div>
      </div>
        
    </section>
  );
}
