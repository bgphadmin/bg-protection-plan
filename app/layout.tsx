import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs"

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
      <html lang="en" suppressHydrationWarning>
        <body className={roboto.className}>
          <div>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
