import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Roof asset portal — University of Bradford",
  description:
    "Live RAG status, audit logging and forecast capital planning for campus roof assets.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-inter)",
              fontSize: "13px",
              border: "0.5px solid rgba(0,0,0,0.1)",
              padding: "10px 14px",
            },
          }}
        />
      </body>
    </html>
  );
}
