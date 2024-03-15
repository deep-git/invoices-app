"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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
        const response = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify(values),
        }).then(res => res.json());

        console.log(response);
    }

    return (
        <section>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-md w-full flex flex-col gap-4">
                    <FormField control={form.control} name="firstName" render={({field}) => {
                        return <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="First Name" type="text" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    }}/>

                    <FormField control={form.control} name="lastName" render={({field}) => {
                        return <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Last Name" type="text" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    }}/>

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

                    <FormField control={form.control} name="passwordConfirm" render={({field}) => {
                        return <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Confirm Password" type="password" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    }}/>

                    <Button type="submit" className="w-full">Sign Up</Button>
                </form>
            </Form>
        </section>
    )
}
