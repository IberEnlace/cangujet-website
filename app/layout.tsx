import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { MetaPixel } from "@/components/MetaPixel";

export const metadata: Metadata = {
  title: "Cangujet | Your restaurant. Your customers.",
  description:
    "Cangujet gives restaurants their own branded app, online ordering, loyalty, reservations, QR menus and connected operations.",
  metadataBase: new URL("https://cangujet.com"),
  openGraph: {
    title: "Cangujet | Restaurant technology that puts you in control",
    description:
      "Own the customer relationship with your branded restaurant app and connected digital ecosystem.",
    type: "website",
    locale: "pt_PT",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07111f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-PT" className="scroll-smooth">
      <body>
        <MetaPixel />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
