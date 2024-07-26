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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body className={inter.className}>
          <Providers>
            <div className="flex flex-col p-8">
              <Navbar />
              <div className="flex-1">{children}</div>
            </div>
          </Providers>
        </body>
      </ThemeProvider>
    </html>
  );
}
