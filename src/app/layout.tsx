import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const spartan = League_Spartan({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Charge-Up",
  description: "Manage all your invoice in one place!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en"  suppressHydrationWarning={true}>
      <link rel="icon" type="image/x-icon" href="/logo.png"/>
      <body className={spartan.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
