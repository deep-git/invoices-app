import LoginForm from "@/components/Form/LoginForm"
import Link from "next/link"

const Login = () => {
  return (
    <section className="flex flex-col gap-10 min-h-screen justify-center items-center bg-primary-foreground">
      <Link href="/">
        <h1 className="text-5xl font-bold">Invoices</h1>
      </Link>
      <div className="w-80">
        <LoginForm/>
      </div>
      <Link href="/register">Don't have an account? <span className="text-purple-500 font-bold">Sign up now!</span></Link>
    </section>
  )
}

export default Login