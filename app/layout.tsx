import type { Metadata } from "next";
import "./globals.css";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
import AudioProvider from "@/providers/AudioProvider";


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
        <AudioProvider>
          <body className={`antialiased`}>{children}</body>
        </AudioProvider>
      </html>
    </ConvexClerkProvider>
  );
}
