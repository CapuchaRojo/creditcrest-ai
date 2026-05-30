import { CalendarClock } from "lucide-react";

import type { LoanTimelineItem } from "@/lib/lendingEngine";

const statusStyles: Record<LoanTimelineItem["status"], string> = {
  Now: "bg-emerald-700 text-white",
  Watch: "bg-amber-400 text-[#06130f]",
  Milestone: "bg-sky-500 text-white",
  Complete: "bg-[#06130f] text-white",
};

export function LoanTimeline({ items }: { items: LoanTimelineItem[] }) {
  return (
    <section className="rounded-lg border border-[#dce5dd] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-black text-[#06130f]">
        <CalendarClock className="h-4 w-4 text-emerald-700" aria-hidden="true" />
        Borrower journey timeline
      </div>
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <article
            key={item.id}
            className="grid grid-cols-[2.25rem_1fr] gap-3 rounded-md border border-[#dce5dd] bg-[#f8faf8] p-3"
          >
            <div className="relative flex justify-center">
              <span
                className={`z-10 flex h-8 w-8 items-center justify-center rounded-md text-xs font-black ${statusStyles[item.status]}`}
              >
                {index + 1}
              </span>
              {index < items.length - 1 ? (
                <span className="absolute top-8 h-[calc(100%+0.75rem)] w-px bg-[#cbd8ce]" />
              ) : null}
            </div>
            <div>
              <p className="text-xs font-black uppercase text-emerald-700">
                {item.label} - {item.status}
              </p>
              <h3 className="mt-1 text-sm font-black text-[#06130f]">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {item.detail}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
