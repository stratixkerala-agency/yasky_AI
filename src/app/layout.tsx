import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Yasky AI | Stratix Internal Platform",
  description: "AI-powered assistant platform for Stratix digital marketing team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} h-full antialiased bg-zinc-950`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}