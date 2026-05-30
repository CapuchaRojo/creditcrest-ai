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
          Educational rules, synthetic data, privacy-first simulation.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          CreditCrest AI is an educational prototype. It is not financial
          advice, does not calculate an official credit score, and does not
          connect to credit bureaus, banks, payroll systems, or real financial
          accounts.
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
            body="The app never asks for SSNs, bank credentials, credit bureau logins, or real card numbers."
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

        <section className="mt-8 rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black text-[#06130f]">
            Lending Lab methodology
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Lending Lab is a simulated borrowing experience. It compares
            educational lending paths before signing anything, without acting as
            a lender, broker, marketplace, or credit bureau.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Rule
              label="Synthetic offers only"
              value="Crest Starter, Builder Secured, FastCash, and Flex Plan are demo examples, not real lender offers."
            />
            <Rule
              label="EMI estimates"
              value="Monthly payment, APR, interest, and total repayment are educational calculations."
            />
            <Rule
              label="Approval-readiness"
              value="Readiness is not approval or denial. It is a directional label from explicit rules."
            />
            <Rule
              label="No sensitive collection"
              value="The app does not ask for SSNs, bank credentials, credit bureau logins, or real income verification."
            />
            <Rule
              label="No lender matching"
              value="No real application is submitted and no provider receives user data."
            />
            <Rule
              label="Deterministic results"
              value="Loan outcomes come from TypeScript rules, not official score prediction or hidden underwriting."
            />
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black text-[#06130f]">
            Calculator Hub methodology
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Calculator Hub keeps calculations scoped to credit, lending,
            financing, and educational borrowing decisions. Inputs default to
            Maya&apos;s synthetic profile and should not be treated as real
            financial applications.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Rule
              label="EMI / monthly payment"
              value="Uses principal minus down payment, APR, and term to estimate monthly payment, total repayment, and total interest."
            />
            <Rule
              label="Utilization paydown"
              value="Calculates the paydown needed to reach 30%, 10%, or a custom educational utilization target."
            />
            <Rule
              label="APR comparison"
              value="Compares synthetic offers by monthly payment, total repayment, and total interest."
            />
            <Rule
              label="Payment burden"
              value="Compares a modeled payment with synthetic monthly income and classifies burden risk."
            />
            <Rule
              label="Credit limit impact"
              value="Shows before/after utilization if balance stays fixed and explains possible inquiry risk."
            />
            <Rule
              label="No sensitive data"
              value="The hub does not collect SSNs, real income verification, bank credentials, or credit bureau logins."
            />
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-[#dce5dd] bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black text-[#06130f]">
            Financial Snapshot methodology
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Financial Snapshot is optional local onboarding for educational
            personalization. It replaces Maya&apos;s demo defaults with rounded,
            non-sensitive inputs stored only in the user&apos;s browser.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Rule
              label="Local-only storage"
              value="Snapshots are saved in browser localStorage and can be deleted from the onboarding page."
            />
            <Rule
              label="Non-sensitive inputs"
              value="The flow asks for nickname, rounded income estimate, debt obligations, card balance, card limit, inquiries, missed-payment range, account age, and goal."
            />
            <Rule
              label="Explicit exclusions"
              value="It does not collect SSNs, account numbers, full birth dates, bank credentials, bureau credentials, documents, or lender application data."
            />
            <Rule
              label="Profile conversion"
              value="The snapshot is converted into the same typed credit and lending profile shapes used by the deterministic engines."
            />
            <Rule
              label="Maya fallback"
              value="If no valid snapshot exists, every page uses the synthetic Maya demo profile."
            />
            <Rule
              label="Education boundaries"
              value="Snapshot results remain educational only, with no financial advice, official score prediction, bureau data, or lender matching."
            />
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
