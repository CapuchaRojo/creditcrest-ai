import { CalculatorHub } from "@/components/CalculatorHub";
import { mayaLendingProfile, syntheticLoanOffers } from "@/lib/demoData";

export default function CalculatorHubPage() {
  return (
    <CalculatorHub profile={mayaLendingProfile} offers={syntheticLoanOffers} />
  );
}
