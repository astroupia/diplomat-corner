import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import { SidebarProvider } from "@/components/admin/sidebar-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Diplomat Corner Admin",
  description: "Admin dashboard for Diplomat Corner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>{children}</SidebarProvider>
      </body>
    </html>
  );
}
