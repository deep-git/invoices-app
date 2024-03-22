import RegisterForm from "@/components/Form/RegisterForm"
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link"
import { redirect } from "next/navigation";

const Register = async () => {

  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <section className="flex flex-col min-h-screen items-center bg-primary-foreground">
      <div className="w-full h-32 bg-primary flex items-center text-primary-foreground">
        <Link href="/" className="flex items-center gap-5">
          <Image src="/logo.png" alt="Invoices logo" width={75} height={75}/>
          <h1 className="text-3xl sm:text-5xl font-bold text-purple-500">Invoices</h1>
        </Link>
      </div>

      <div className="flex-1 w-full flex flex-col justify-center items-center">
        <h2 className="text-3xl font-semibold">Register</h2>
        <div className="mt-10 w-[80%] max-w-80">
          <RegisterForm/>
        </div>
        <Link href="/login" className="mt-5 w-[80%] max-w-80">Already have an account? <span className="text-purple-500 font-bold">Log in</span></Link>
      </div>
      
    </section>
  )
}

export default Register