import type { Metadata } from "next";
import { QRContactPage } from "@/components/QRContactPage";

export const metadata: Metadata = {
  title: "QR Contact | Cangujet",
  description: "Contact Cangujet from a QR code and request restaurant technology information.",
};

export default function Page() {
  return <QRContactPage />;
}
