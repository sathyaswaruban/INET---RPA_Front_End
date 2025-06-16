import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import localFont from "next/font/local";
import { Globe } from "@/components/magicui/globe";
import PageTransition from "@/components/PageTransition";
import PageTransitionWrapper from "@/components/PageTransitionWrapper";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const inetFont = localFont({
  variable: "--font-myfont",
  display: "swap",
  src: [
    {
      path: "../public/fonts/Nunito/static/Nunito-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Nunito/static/Nunito-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Nunito/static/Nunito-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Nunito/static/Nunito-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/Nunito/static/Nunito-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Nunito/static/Nunito-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/Nunito/static/Nunito-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Nunito/static/Nunito-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/Nunito/static/Nunito-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/Nunito/static/Nunito-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../public/fonts/Nunito/static/Nunito-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/Nunito/static/Nunito-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
    {
      path: "../public/fonts/Nunito/static/Nunito-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Nunito/static/Nunito-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/Nunito/static/Nunito-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/Nunito/static/Nunito-ExtraLightItalic.ttf",
      weight: "200",
      style: "italic",
    },
  ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Report Reconciliation",
  description: "A tool used to reconcil vendor data with internal Database entries.",
    icons: {
    icon: "/favicon.ico", // or a custom path like "/rr-icon.png"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inetFont.className}>
        {/* <PageTransitionWrapper> */}
        {/* <PageTransition> */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main className="flex w-full  flex-col items-center justify-start mx-auto min-h-screen">
            <section className="w-full  ">{children}</section>
          </main>
        </ThemeProvider>
        <Toaster position="top-center" richColors /> {/* ✅ sonner Toaster */}

        {/* </PageTransition> */}
        {/* </PageTransitionWrapper> */}
      </body>
    </html>
  );
}
