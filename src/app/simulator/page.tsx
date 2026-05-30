import { Suspense } from "react";

import { DecisionSimulator } from "@/components/DecisionSimulator";
import { mayaProfile } from "@/lib/demoData";

export default async function SimulatorPage({
  searchParams,
}: {
  searchParams: Promise<{ scenario?: string }>;
}) {
  const scenarioId = (await searchParams).scenario ?? null;

  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f6f8f5] px-4 py-10">
          <div className="mx-auto max-w-7xl rounded-lg border border-[#dce5dd] bg-white p-6 text-sm font-semibold text-slate-700">
            Loading simulator...
          </div>
        </main>
      }
    >
      <DecisionSimulator
        key={scenarioId ?? "custom"}
        profile={mayaProfile}
        initialScenarioId={scenarioId}
      />
    </Suspense>
  );
}
