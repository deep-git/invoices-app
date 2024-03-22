"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const formSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    passwordConfirm: z.string()
}).refine((data) => {
    return data.password === data.passwordConfirm
}, {
    message: "Passwords do not match",
    path: ["passwordConfirm"]
})

export default function RegisterForm() {

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            passwordConfirm: ""
        }
    })

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        const response = await fetch(`/api/auth/register`, {
            method: 'POST',
            body: JSON.stringify({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
                theme: "light"
            }),
        });

        console.log({response});
        if (response.ok) {
            signIn("credentials", {
                email: values.email,
                password: values.password,
                callbackUrl: "/dashboard"
            })
        }
    }

    return (
        <section>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-md w-full flex flex-col gap-4">
                    <FormField control={form.control} name="firstName" render={({field}) => {
                        return <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input className="bg-primary border-[#7c5df9] border-opacity-50" placeholder="First Name" type="text" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    }}/>

                    <FormField control={form.control} name="lastName" render={({field}) => {
                        return <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input className="bg-primary border-[#7c5df9] border-opacity-50" placeholder="Last Name" type="text" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    }}/>

                    <FormField control={form.control} name="email" render={({field}) => {
                        return <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input className="bg-primary border-[#7c5df9] border-opacity-50" placeholder="Email" type="email" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    }}/>

                    <FormField control={form.control} name="password" render={({field}) => {
                        return <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input className="bg-primary border-[#7c5df9] border-opacity-50" placeholder="Password" type="password" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    }}/>

                    <FormField control={form.control} name="passwordConfirm" render={({field}) => {
                        return <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input className="bg-primary border-[#7c5df9] border-opacity-50" placeholder="Confirm Password" type="password" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    }}/>

                    <Button type="submit" className="w-full mt-5 bg-[#7c5df9] hover:bg-[#6448d6]">Sign Up</Button>
                </form>
            </Form>
        </section>
    )
}
