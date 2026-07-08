import type { Metadata } from "next";
import { MobileAppLanding } from "@/components/MobileAppLanding";

export const metadata: Metadata = {
  title: "Restaurant Mobile App | Cangujet",
  description:
    "Launch your own branded restaurant mobile app with Cangujet. Accept direct orders, build loyalty and grow without marketplace commissions.",
};

export default function MobileAppPage() {
  return <MobileAppLanding />;
}
