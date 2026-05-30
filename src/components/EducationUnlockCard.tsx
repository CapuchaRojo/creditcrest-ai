import { GraduationCap } from "lucide-react";

import type { EducationUnlock } from "@/lib/lendingEngine";

export function EducationUnlockCard({ unlock }: { unlock: EducationUnlock }) {
  return (
    <article className="rounded-lg border border-[#dce5dd] bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#eaf7ef] text-emerald-700">
          <GraduationCap className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-black uppercase text-emerald-700">
            {unlock.title}
          </p>
          <h3 className="mt-1 text-base font-black text-[#06130f]">
            {unlock.concept}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {unlock.detail}
          </p>
        </div>
      </div>
    </article>
  );
}
