import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

// Display / headings — Poppins (geometric sans, matches the brand reference)
const poppinsDisplay = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Body / UI — Poppins, lighter weights for legibility at data-dense sizes
const poppinsBody = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FutureOS — a proposal for Sycamore Square Group",
  description:
    "A FutureAnalytics proposal for Sycamore Square Group: FutureOS, a custom AI operating system built on your own data — with a live, clickable product demo inside.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Allow pinch-zoom for accessibility, but keep the base scale at 1 so the
  // responsive layout drives sizing on phones and tablets.
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppinsDisplay.variable} ${poppinsBody.variable} antialiased`}>
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
