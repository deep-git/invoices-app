import Sidebar from "@/components/Sidebar/Sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Charge-Up / Account",
  description: "Manage all your invoice in one place!",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen md:flex-row bg-primary">
      <Sidebar/>
      <div className="relative w-full flex justify-center mt-5 lg:mt-44">
        {children}
      </div>
    </div>
  )
}

export default layout;