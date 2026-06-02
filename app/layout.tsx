import type { Metadata } from "next";
import { Cairo, Nunito_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Roof asset portal — Sycamore Square × University of Bradford",
  description:
    "Live RAG status, audit logging, data entry and capital planning for campus roof assets. By Sycamore Square Group.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cairo.variable} ${nunito.variable} antialiased`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-nunito)",
              fontSize: "13px",
              padding: "12px 16px",
            },
          }}
        />
      </body>
    </html>
  );
}
