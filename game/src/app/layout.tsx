import Providers from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "dChess",
  description: "Chess on-chain",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      url: "./icon.png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <div className="flex flex-col p-8 h-[100vh] w-[100vw]">
              <Navbar />
              {children}
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
