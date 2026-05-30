"use client";

import { ScenarioCard } from "@/components/ScenarioCard";
import { mayaProfile, prebuiltScenarios } from "@/lib/demoData";
import { useFinancialSnapshotProfile } from "@/lib/useFinancialSnapshot";

export default function ScenariosPage() {
  const activeProfile = useFinancialSnapshotProfile(mayaProfile);

  return (
    <main className="min-h-screen bg-[#f6f8f5]">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase text-emerald-700">
              Scenario Library
            </p>
            <h1 className="mt-2 text-3xl font-black text-[#06130f] sm:text-4xl">
              One-click credit decisions.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Each scenario opens the simulator with deterministic inputs and a
              plain-English result for the active learning profile.
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {prebuiltScenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              profile={activeProfile}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
