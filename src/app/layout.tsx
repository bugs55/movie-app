import type { Metadata } from "next";
import { Afacad } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

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
        className={`${afacad.className} antialiased bg-movie-dark text-slate-200`}
      >
        <main className="container min-h-screen">
          <Header />
          {children}
        </main>
        <footer className="mt-6 flex justify-center items-center lg:h-16 h-12 bg-gray-950 text-slate-200">
          &copy; Made by
          <a
            href="https://github.com/bugs55"
            target="_blank"
            className="font-bold underline ml-1"
          >
            Konrad Szczepanowski
          </a>
        </footer>
      </body>
    </html>
  );
}
