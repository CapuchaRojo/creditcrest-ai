import { FinancialSnapshotOnboarding } from "@/components/FinancialSnapshotOnboarding";
import { mayaLendingProfile } from "@/lib/demoData";

export default function OnboardingPage() {
  return <FinancialSnapshotOnboarding fallbackProfile={mayaLendingProfile} />;
}
