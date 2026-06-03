import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

// Display / headings — modern geometric sans with punchy bold weights
const montserrat = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Body / UI — clean, highly legible at data-dense sizes
const roboto = Roboto({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
      <body className={`${montserrat.variable} ${roboto.variable} antialiased`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              padding: "12px 16px",
            },
          }}
        />
      </body>
    </html>
  );
}
