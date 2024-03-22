"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export default function LoginForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const router = useRouter();

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        const response = await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false,
        });

        console.log({response});
        if (!response?.error) {
            router.push("/dashboard");
            router.refresh();
        }
    }

    return (
        <section>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-md w-full flex flex-col gap-4">

                    <FormField control={form.control} name="email" render={({field}) => {
                        return <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email" type="email" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    }}/>

                    <FormField control={form.control} name="password" render={({field}) => {
                        return <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Password" type="password" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    }}/>

                    <Button type="submit" className="w-full">Login</Button>
                </form>
            </Form>
        </section>
    )
}