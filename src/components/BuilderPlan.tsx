"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Circle, Target } from "lucide-react";

import {
  creditFactorLabels,
  type ThirtyDayPlanWeek,
} from "@/lib/creditEngine";

const storageKey = "creditcrest:plan-progress";

export function BuilderPlan({ plan }: { plan: ThirtyDayPlanWeek[] }) {
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    const stored = window.localStorage.getItem(storageKey);
    return stored ? (JSON.parse(stored) as Record<string, boolean>) : {};
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(completed));
  }, [completed]);

  const actionIds = useMemo(
    () =>
      plan.flatMap((week) =>
        week.actions.map((_, index) => `${week.id}-action-${index}`),
      ),
    [plan],
  );
  const completedCount = actionIds.filter((id) => completed[id]).length;
  const progress = Math.round((completedCount / actionIds.length) * 100);

  function toggle(id: string) {
    setCompleted((current) => ({ ...current, [id]: !current[id] }));
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
      <section className="rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#eaf7ef] text-emerald-700">
          <Target className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-2xl font-black text-[#06130f]">
          30-day builder plan
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          A short, practical path for Maya: lower visible utilization, protect
          payments, pause new applications, then review the file.
        </p>
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm font-bold">
            <span className="text-slate-600">Progress</span>
            <span className="text-[#06130f]">{progress}%</span>
          </div>
          <div
            className="mt-2 h-2 rounded-md bg-slate-100"
            role="progressbar"
            aria-label="Plan progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="h-2 rounded-md bg-emerald-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-3">
        {plan.map((week) => (
          <article
            key={week.id}
            className="rounded-lg border border-[#dce5dd] bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-bold text-emerald-700">
                  Week {week.week} - {creditFactorLabels[week.factor]}
                </p>
                <h3 className="mt-1 text-xl font-black text-[#06130f]">
                  {week.title}
                </h3>
              </div>
              <div className="rounded-md bg-[#eaf7ef] px-3 py-2 text-sm font-bold text-emerald-900">
                {week.target}
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{week.detail}</p>
            <div className="mt-4 grid gap-2">
              {week.actions.map((action, index) => {
                const id = `${week.id}-action-${index}`;
                const isDone = Boolean(completed[id]);

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggle(id)}
                    className={`flex items-start gap-3 rounded-md border px-3 py-3 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                      isDone
                        ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                        : "border-[#dce5dd] bg-[#f8faf8] text-slate-700 hover:border-emerald-300"
                    }`}
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                      {isDone ? (
                        <Check className="h-4 w-4 text-emerald-700" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-400" />
                      )}
                    </span>
                    <span className={isDone ? "font-semibold" : ""}>{action}</span>
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
