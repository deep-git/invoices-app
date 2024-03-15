import RegisterForm from "@/components/Form/RegisterForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="flex min-h-screen justify-center items-center bg-primary-foreground">
      <div className="flex flex-col gap-4">
        <h1>Invoices App</h1>

          <Link href="/register">
            <Button>Register</Button>
          </Link>

          <Link href="/login">
            <Button>Login</Button>
          </Link>
      </div>
    </section>
  );
}
