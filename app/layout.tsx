import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Providers from "../providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bachelor Thesis Dashboard",
  description:
    "Welcome to the dashboard of my Bachelor Thesis. This dashboard is used to collect the necessary data for my research.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider waitlistUrl="/">
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Header></Header>
          <Toaster richColors></Toaster>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
