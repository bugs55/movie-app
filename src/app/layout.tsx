import type { Metadata } from "next";
import { Afacad } from "next/font/google";
import "./globals.css";
import MovieIcon from "@/icons/MovieIcon";
import Link from "next/link";
import { Input } from "@/components/ui/input";

const afacad = Afacad({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Movie App",
  description: "Database with movies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${afacad.className} antialiased bg-movie-dark text-slate-200 w-screen h-screen`}
      >
        <main className="container">
          <div className="px-5 w-full h-[80px] font-semibold text-movie-orange text-3xl flex items-center justify-between">
            <Link href={"/"}>
              <div className="flex gap-4 items-center">
                <MovieIcon fontSize={35} />
                Movie Database
              </div>
            </Link>
            <div className="w-[300px]">
              <Input type="text" placeholder="Search" />
            </div>
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
