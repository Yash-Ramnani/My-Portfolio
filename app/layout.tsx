import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Yash Ramnani | Portfolio",
  description:
    "Luxury tech-inspired portfolio of Yash Ramnani, Full Stack Developer, featuring projects, skills, experience, and contact details.",
  metadataBase: new URL("https://my-portfolio-six-alpha-81.vercel.app"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Yash Ramnani | Portfolio",
    description:
      "Modern full stack developer portfolio with projects, skills, and contact details.",
    url: "/",
    siteName: "Yash Portfolio",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${cormorant.variable}`}>{children}</body>
    </html>
  );
}
