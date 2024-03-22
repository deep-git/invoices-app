import LoginForm from "@/components/Form/LoginForm"
import { getServerSession } from "next-auth"
import Image from "next/image";
import Link from "next/link"
import { redirect } from "next/navigation";

const Login = async () => {

  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }
  
  return (
    <section className="flex flex-col min-h-screen items-center bg-primary-foreground">
      <div className="relative w-full h-32 bg-primary flex items-center text-primary-foreground">
        <Link href="/" className="flex items-center gap-5">
          <Image src="/logo.png" alt="Invoices logo" width={75} height={75}/>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#7c5df9]">Charge-Up</h1>
        </Link>
      </div>

      <div className="background_designs w-full relative flex-1 flex bg-primary flex-col">

        <div className="flex-1 w-full flex flex-col justify-center items-center text-[#7c5df9]">
          <div className="flex flex-col bg-slate-900/70 w-[90%] sm:w-96 p-10 rounded-lg">
            <h2 className="text-[3em] font-semibold">Login</h2>
            <div className="mt-5 w-full">
              <LoginForm/>
            </div>
            <Link href="/register" className="mt-5 w-[80%] max-w-80 text-white hover:underline">Don't have an account? <span className="text-[#7c5df9] font-bold">Sign up</span></Link>
          </div>
        </div>
      </div>
      
    </section>
  )
}

export default Login