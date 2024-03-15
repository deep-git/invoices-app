import RegisterForm from "@/components/Form/RegisterForm"
import Link from "next/link"

const Register = () => {
  return (
    <section className="flex flex-col gap-10 min-h-screen justify-center items-center bg-primary-foreground">
      <Link href="/">
        <h1 className="text-5xl font-bold">Invoices</h1>
      </Link>
      <div className="w-80">
        <RegisterForm/>
      </div>
      <Link href="/login">Already have an account? <span className="text-purple-500 font-bold">Log in</span></Link>
    </section>
  )
}

export default Register