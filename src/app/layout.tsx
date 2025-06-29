import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {CustomProvider} from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CustomProvider>
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
        </CustomProvider>
      </body>
    </html>
  );
}
