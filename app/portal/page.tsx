import { Metadata } from "next";
import PortalWorkspace from "@/components/portal-workspace";

export const metadata: Metadata = {
  title: "UPUA Member & Leadership Portal | Urhobo Progress Union America",
  description: "Official administrative and membership portal for Urhobo Progress Union America (UPUA). Access national records, chapter intelligence, dues, and meeting minutes.",
};

export default function PortalPage() {
  return <PortalWorkspace />;
}
