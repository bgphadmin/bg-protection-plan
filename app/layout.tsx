import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn } from "@clerk/nextjs"
import Navbar from "@/components/navbar/Navbar";
import BottomNavbar from "@/components/bottomNavbar/BottomNavbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BG Protection Plan App",
  description: "Monitors and maintains the protection plans of BG customers",
  keywords: ["Engine oil additives", "BG", "BG products", "Vehicle Protection Plan", "Engine performance improvement"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={roboto.className} suppressHydrationWarning>
          <SignedIn>
            <div className="container">
              <Navbar />
            </div>
          </SignedIn>
          {children}
          <SignedIn>
            <BottomNavbar />
          </SignedIn>
          <ToastContainer />
        </body>
      </html>
    </ClerkProvider>
  );
}
