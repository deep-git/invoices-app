"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "../definitions";
import Logout from "../logout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import * as LR from '@uploadcare/blocks';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useRouter } from "next/navigation";
import UploadButtonArea from "@/components/UploadButton/UploadButton";
import { signOut } from "next-auth/react";
import { CircularProgress } from '@mui/material';
import { IoMdArrowRoundBack } from "react-icons/io";

LR.registerBlocks(LR);

const fetchUser = async() => {
    const response = await fetch("/api/user/account");
    const data = await response.json();
    
    return data.response.rows[0];
}

const saveUserInfo = async(firstname: string, lastname: string) => {
    const response = await fetch("/api/user/account", {
        method: "PUT",
        body: JSON.stringify({
            firstName: firstname,
            lastName: lastname
        })
    });
}

const saveNewInfo = async(currentPassword: string, newPassword: string) => {
    const response = await fetch("/api/user/account/new", {
        method: "PUT",
        body: JSON.stringify({
            currentPassword,
            newPassword
        })
    });

    const data = await response.json();

    return [data.response, data.message];
}

const fetchSaveUserImage = async(images: string | StaticImport) => {
    const response = await fetch("/api/user/account/userImage", {
        method: "PUT",
        body: JSON.stringify({
            images
        })
    })
}

const deleteUserInfo = async() => {
    const response = await fetch("/api/user/account", {
        method: "DELETE"
    });
}

const Account = () => {

    const [user, setUser] = useState<User>();
    const [isLoading, setLoading] = useState<Boolean>(false);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [saveChanges, setSaveChanges] = useState<Boolean>(false);
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [samePassword, setSamePassword] = useState<Boolean>(false);
    const [error, setError] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const router = useRouter();

    const [images, setImages] = useState<string | StaticImport>("");

    const handleRefresh = () => {
        router.refresh();
    }

    useEffect(() => {
        setLoading(true);
        const fetchUserData = async() => {
            const data = await fetchUser();
            setUser(data);
            setFirstName(data.firstname);
            setLastName(data.lastname);
            setLoading(false);
        }

        fetchUserData();
    }, [saveChanges]);

    async function handleSaveAccount() {
        if (firstName.length !== 0 && lastName.length !== 0) {
            const saveUser = await saveUserInfo(firstName, lastName);
            setSaveChanges(prev => !prev);
        }
    }

    function handleChangeFirst(e: any) {
        setFirstName(e.target.value);
    }

    function handleChangeLast(e: any) {
        setLastName(e.target.value);
    }

    function handleImageSelect(imageContent: any) {
        setImages(imageContent[0].url);
    }

    async function handleSaveImage() {
        const dataImage = await fetchSaveUserImage(images);
        setSaveChanges(prev => !prev);

        handleRefresh();
    }

    async function handleDelete() {
        const dataDelete = await deleteUserInfo();

        signOut();
        router.push("/");
    }

    async function handleSavePassword() {
        if (currentPassword !== newPassword && currentPassword.length !== 0 && newPassword.length !== 0) {
            setSamePassword(false);

            const updateUserInfo = await saveNewInfo(currentPassword, newPassword);
            setError(updateUserInfo[1]);

            if (updateUserInfo[1] === "Password successfully changed.") {
                signOut();
            }
        } else {
            setSamePassword(true);

            setError("Passwords cannot be empty or the same.")
        }
    }

  return (
    <MaxWidthWrapper>
        <div className="flex items-center">
            {isLoading ? (
                <div className="flex justify-center items-center text-card font-xl w-full h-96">
                    <CircularProgress/>
                </div>
            ) : (
                <div className="w-full p-5 flex flex-col">
                    <Link href="/dashboard" className="bg-purple_hover px-5 py-3 text-[#7c5df9] font-semibold rounded-tl-lg rounded-tr-lg hover:bg-[#2d2557]">
                        <span className="flex items-center gap-2"><IoMdArrowRoundBack /> Back</span>
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-10 bg-invoice_card_border_foreground rounded-bl-lg rounded-br-lg w-full justify-center items-center h-max py-10 px-5 lg:px-10 lg:h-[550px]">
                        <div className="flex flex-col lg:w-full text-card flex-wrap gap-5 justify-center items-center">
                            <div className="relative w-20 h-20 rounded-full bg-slate-100 border-[2px] border-slate-300 overflow-hidden">
                                {user?.image === undefined || user?.image === null || user?.image === "" && <Image src="/user.png" alt="Profile Image" fill className="w-auto h-auto object-cover"/>}
                                {user?.image !== undefined && user?.image !== null && user?.image !== "" && <Image src={user?.image} alt="Profile Image" fill className="w-auto h-auto object-cover"/>}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex flex-wrap gap-3 justify-center">
                                    <span className="text-5xl">{user?.firstname}</span>
                                    <span className="text-5xl">{user?.lastname}</span>
                                </div>
                                <div className="text-center">
                                    <span>{user?.email}</span>
                                </div>
                            </div>
                            <Logout/>
                        </div>

                        <div className="relative w-full flex flex-col gap-5 items-center justify-center">
                        <Tabs defaultValue="account" className="w-[85%] lg:w-[450px]">
                            <TabsList className="flex flex-wrap h-max">
                                <TabsTrigger value="account">Account</TabsTrigger>
                                <TabsTrigger value="profile">Image</TabsTrigger>
                                <TabsTrigger value="password">Password</TabsTrigger>
                            </TabsList>

                            <TabsContent value="account">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Account</CardTitle>
                                        <CardDescription>Make changes to your account here.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="space-y-1">
                                            <Label htmlFor="first">First Name</Label>
                                            <Input id="first" value={firstName} onChange={(e) => handleChangeFirst(e)} required className={cn("", {
                                                "outline-red-500 ring-red-500 border-red-500": firstName.length === 0
                                            })}/>
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="last">Last Name</Label>
                                            <Input id="last" value={lastName} onChange={(e) => handleChangeLast(e)} required className={cn("", {
                                                "outline-red-500 ring-red-500 border-red-500": lastName.length === 0
                                            })}/>
                                        </div>
                                        
                                    </CardContent>
                                    <CardFooter>
                                        <Button onClick={() => handleSaveAccount()}>Save changes</Button>
                                    </CardFooter>
                                </Card>
                                
                            </TabsContent>

                            <TabsContent value="profile">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Profile Image</CardTitle>
                                        <CardDescription>Change your profile image here.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col text-card lg:flex-row gap-5 items-center space-y-2">
                                        <div>
                                            {images?[0].length === 1 && (
                                                <Image src={`${images}`} alt="Image selected" width={200} height={200}/>
                                            ) : (
                                                null
                                            )}
                                            
                                        </div>
                                        <UploadButtonArea handleImageSelect={handleImageSelect}/>
                                    </CardContent>
                                    <CardFooter>
                                        <Button onClick={() => handleSaveImage()}>Update Image</Button>
                                    </CardFooter>
                                </Card>
                                
                            </TabsContent>

                            <TabsContent value="password">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Password</CardTitle>
                                        <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="space-y-1">
                                            <Label htmlFor="current_password">Current password</Label>
                                            <Input id="current_password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/>
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="new_password">New password</Label>
                                            <Input id="new_password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                                        </div>
                                        {error && (
                                            <div>
                                                <span className="text-red-500">{error}</span>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter>
                                        <Button onClick={() => handleSavePassword()}>Save password</Button>
                                    </CardFooter>
                                </Card>
                                
                            </TabsContent>
                            
                        </Tabs>
                        
                        <div className="flex justify-end">
                            <Dialog>
                                <DialogTrigger>
                                <div className="h-10 flex justify-center items-center text-white bg-rose-600 hover:bg-rose-700 px-6 rounded-lg">Delete</div>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Are you sure you would like to delete your account?</DialogTitle>
                                    <DialogDescription>This action cannot be undone. To confirm permanently deleting this account and all of its data from our servers, please enter your password:</DialogDescription>

                                    <div>
                                        <Input id="delete_invoice" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary" onClick={() => setConfirmPassword("")}>
                                                Close
                                            </Button>
                                        </DialogClose>
                                        <Button onClick={() => handleDelete()} type="submit" variant="destructive">Delete</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div> 
                    </div>
                </div>
            </div>
            )}
        </div>
    </MaxWidthWrapper>
  )
}

export default Account;