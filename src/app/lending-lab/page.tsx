import { LendingLab } from "@/components/LendingLab";
import { mayaLendingProfile, syntheticLoanOffers } from "@/lib/demoData";

export default function LendingLabPage() {
  return (
    <LendingLab profile={mayaLendingProfile} offers={syntheticLoanOffers} />
  );
}
