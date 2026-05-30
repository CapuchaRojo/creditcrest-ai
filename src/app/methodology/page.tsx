import { LockKeyhole, Scale, ShieldCheck } from "lucide-react";

import { creditFactorLabels } from "@/lib/creditEngine";

const factors = [
  "paymentHistory",
  "utilization",
  "creditAge",
  "newCredit",
  "creditMix",
] as const;

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-[#f6f8f5]">
      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <p className="text-sm font-bold uppercase text-emerald-700">
          About / Compliance / Methodology
        </p>
        <h1 className="mt-2 text-3xl font-black text-[#06130f] sm:text-4xl">
          Educational rules, synthetic data, privacy-first demo.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          CreditCrest AI is a hackathon MVP. It is not financial advice, does
          not calculate an official credit score, and does not connect to credit
          bureaus, banks, payroll systems, or real financial accounts.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Principle
            icon={Scale}
            title="Directional estimates only"
            body="The app uses Low, Medium, High, and Critical risk levels rather than score-point predictions."
          />
          <Principle
            icon={ShieldCheck}
            title="Synthetic profile only"
            body="Maya is a demo persona with mock balances, inquiries, and account-age data."
          />
          <Principle
            icon={LockKeyhole}
            title="No sensitive identifiers"
            body="The MVP never asks for SSNs, bank credentials, credit bureau logins, or real card numbers."
          />
        </div>

        <section className="mt-8 rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black text-[#06130f]">
            Rules engine methodology
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The core recommendation layer is deterministic TypeScript. A future
            AI coach could rewrite explanations, but the risk decision must come
            from explicit rules that can be tested and reviewed.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Rule label="Utilization under 10%" value="Excellent / Low risk" />
            <Rule label="Utilization 10-29%" value="Good / Low risk" />
            <Rule label="Utilization 30-49%" value="Caution / Medium risk" />
            <Rule label="Utilization 50-74%" value="High risk" />
            <Rule label="Utilization 75%+" value="Critical risk" />
            <Rule
              label="Any missed payment"
              value="Critical payment history warning"
            />
            <Rule
              label="New application"
              value="Medium risk, High if recent inquiries already exist"
            />
            <Rule
              label="Minimum-only payment"
              value="Warns about balance persistence"
            />
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black text-[#06130f]">
            Modeled credit factors
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {factors.map((factor) => (
              <div
                key={factor}
                className="rounded-md border border-[#dce5dd] bg-[#f8faf8] p-4"
              >
                <h3 className="font-black text-[#06130f]">
                  {creditFactorLabels[factor]}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {factorCopy[factor]}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function Principle({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#eaf7ef] text-emerald-700">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-black text-[#06130f]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </article>
  );
}

function Rule({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#dce5dd] bg-[#f8faf8] p-4">
      <p className="text-sm font-black text-[#06130f]">{label}</p>
      <p className="mt-1 text-sm text-slate-600">{value}</p>
    </div>
  );
}

const factorCopy: Record<(typeof factors)[number], string> = {
  paymentHistory:
    "Models the risk of missing payment obligations and the recovery path after a late payment.",
  utilization:
    "Compares current card balance with credit limit and classifies the visible balance pressure.",
  creditAge:
    "Highlights that new accounts can temporarily reduce average age for early credit builders.",
  newCredit:
    "Flags applications, inquiries, and account openings, especially when inquiries already exist.",
  creditMix:
    "Treats financing and installment products as tradeoffs rather than automatic benefits.",
};
