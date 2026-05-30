import { BuilderPlan } from "@/components/BuilderPlan";
import { mayaProfile } from "@/lib/demoData";

export default function PlanPage() {
  return (
    <main className="min-h-screen bg-[#f6f8f5]">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase text-emerald-700">
            Credit Builder Plan
          </p>
          <h1 className="mt-2 text-3xl font-black text-[#06130f] sm:text-4xl">
            A 30-day path for the active learning profile.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            The plan uses your local Financial Snapshot when one exists, or the
            Maya demo profile as a fallback. It focuses on actions that reduce
            risk without pretending to predict score points.
          </p>
        </div>
        <BuilderPlan profile={mayaProfile} />
      </section>
    </main>
  );
}
