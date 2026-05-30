import { CreditDashboard } from "@/components/CreditDashboard";
import { mayaProfile, prebuiltScenarios } from "@/lib/demoData";

export default function Home() {
  return <CreditDashboard profile={mayaProfile} scenarios={prebuiltScenarios} />;
}
