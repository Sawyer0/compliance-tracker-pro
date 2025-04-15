import "./globals.css";
import { type Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Compliance Tracker Dashboard",
  description: "Built with passsion by Dawan Sawyer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        {/* Layout UI */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
