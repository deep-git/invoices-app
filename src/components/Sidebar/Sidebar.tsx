"use client";

import Image from "next/image"
import { HiSun } from "react-icons/hi";
import { FaMoon } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

const fetchUserImage = async() => {
  const response = await fetch("/api/user/account/userImage", {
    method: "GET"
  })

  const data = await response.json();

  return data.response.rows[0].image;
}

const Sidebar = () => {

  const [mounted, setMounted] = useState<Boolean>(false);
  const { theme, setTheme } = useTheme();
  const [images, setImages] = useState<string | StaticImport>();
  const [isLoading, setLoading] = useState<Boolean>(false);

  useEffect(() => {
    setMounted(true);

    setLoading(true);
    const fetchImage = async() => {
      const dataImage = await fetchUserImage();
      setImages(dataImage);
      setLoading(false);
    }

    fetchImage();
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="flex flex-row sticky top-0 left-0 z-50 text-card md:flex-col justify-between items-center md:min-h-screen w-full h-max md:w-max md:h-full bg-[#1f213a] md:rounded-tr-[25px] md:rounded-br-[25px] overflow-hidden">
      <Link href="/dashboard">
        <Image src="/logo.png" alt="Invoices logo" width={100} height={100} priority/>
      </Link>

        <div className="flex h-[100px] md:h-full md:flex-col md:w-full">
            <div className="flex justify-center w-20 h-full md:w-full md:h-20 items-center">
              {theme === "light" ? (
                <HiSun onClick={() => setTheme('dark')} className="text-slate-300 w-5 h-5"/>
              ) : (
                <FaMoon onClick={() => setTheme('light')} className="text-slate-300 w-5 h-5"/>
              )}
            </div>
            <div className="flex justify-center items-center w-28 h-full md:w-full md:h-28 border-l-[1px] border-l-slate-300 md:border-t-[1px] md:border-t-slate-300 md:border-l-0">

              {isLoading === false && (
                <Link href="/account" className="relative w-14 h-14 rounded-full overflow-hidden border-[2px] border-transparent hover:border-sky-600">
                  {images === null || images === undefined || images === "" ? (
                    <Image src="/user.png" alt="Image avatar" fill className="rounded-full bg-slate-400 w-auto h-auto object-cover"/>
                    
                  ) : (
                    <Image src={images} alt="Image avatar" fill className="rounded-full w-auto h-auto object-cover"/>
                  )}
                </Link>
              )} 
            </div>
        </div>
    </nav>
  )
}

export default Sidebar