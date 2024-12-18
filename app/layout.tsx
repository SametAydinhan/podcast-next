import type { Metadata } from "next";
import "./globals.css";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";


export const metadata: Metadata = {
  title: "Next Podcast",
  description: "Generate your podcast using AI",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
    <html lang='en'>
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
    </ConvexClerkProvider>
  );
}
