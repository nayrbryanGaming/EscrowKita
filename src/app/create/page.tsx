"use client";
export const dynamic = "force-dynamic";
import { useState, useRef, useEffect } from "react";
import { useNotification } from "@/app/providers";

const steps = [
  { label: "Payee", desc: "Alamat wallet penerima dana" },
  { label: "Amount", desc: "Jumlah IDRX yang di-escrow" },
  { label: "Timeout", desc: "Batas waktu (detik) escrow aktif" },
  { label: "Milestones", desc: "Tahapan pembayaran" },
  { label: "Review", desc: "Cek ulang semua data" },
];
export default function CreateEscrowPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    payee: "",
    amount: "",
    timeout: "",
    milestones: [""],
  });
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const { notify } = useNotification();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus input on step change
    if (inputRef.current) inputRef.current.focus();
  }, [step]);

  function validateStep() {
    const errs: any = {};
    if (step === 0 && !form.payee) errs.payee = "Payee address required";
    if (step === 1 && (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)) errs.amount = "Valid amount required";
    if (step === 2 && (!form.timeout || isNaN(Number(form.timeout)) || Number(form.timeout) < 60)) errs.timeout = "Timeout min 60s";
    if (step === 3 && form.milestones.some(m => !m)) errs.milestones = "All milestones required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (validateStep()) setStep(s => s + 1);
  }
  function prev() {
    setStep(s => Math.max(0, s - 1));
  }

  function handleChange(e: any) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleMilestoneChange(i: number, v: string) {
    setForm(f => ({ ...f, milestones: f.milestones.map((m, idx) => idx === i ? v : m) }));
  }

  function addMilestone() {
    setForm(f => ({ ...f, milestones: [...f.milestones, ""] }));
  }

  function removeMilestone(i: number) {
    setForm(f => ({ ...f, milestones: f.milestones.filter((_, idx) => idx !== i) }));
  }

  async function submit() {
    setSubmitting(true);
    try {
      // TODO: Integrate with contract, wallet, etc.
      // Simulasi sukses
      await new Promise(res => setTimeout(res, 1200));
      notify("success", "Escrow created! (Integrate with contract)");
      // TODO: Redirect ke detail escrow setelah integrasi
    } catch (e: any) {
      notify("error", e?.message || "Failed to create escrow");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-2 py-8 bg-gradient-to-br from-[#f8fafc] via-[#e0f7fa] to-[#e0e7ef] dark:from-[#0A2540] dark:via-[#1e293b] dark:to-[#0b1530] animate-fade-in-up">
      <section className="w-full max-w-2xl mx-auto flex flex-col items-center gap-10">
        <div className="card w-full flex flex-col gap-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-blue-700 dark:text-blue-400 text-center drop-shadow-xl">Create Escrow</h1>
          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-center gap-0 mb-8">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg border-2 transition-all duration-300
                  ${step === i ? "bg-blue-700 text-white border-blue-700 scale-110 shadow-lg" : step > i ? "bg-blue-100 dark:bg-blue-900 text-blue-700 border-blue-400" : "bg-gray-200 dark:bg-gray-800 text-gray-400 border-gray-300"}`}>{i + 1}</div>
                {i < steps.length - 1 && <div className="w-12 h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 dark:from-blue-900 dark:via-blue-700 dark:to-blue-900 mx-1 rounded-full" />}
              </div>
            ))}
          </div>
          <div className="text-center text-xl font-bold text-blue-700 dark:text-blue-400 mb-2 transition-all min-h-[28px]">{steps[step].label}</div>
          <div className="text-center text-gray-500 dark:text-gray-400 mb-6 min-h-[20px]">{steps[step].desc}</div>

          {/* Step Content */}
          <div className="w-full">
            {step === 0 && (
              <div className="animate-fade-in-up">
                <label className="block font-semibold mb-2">Payee Address</label>
                <input ref={inputRef} name="payee" value={form.payee} onChange={handleChange} className="input input-bordered w-full text-lg" placeholder="0x..." autoFocus />
                {errors.payee && <div className="text-red-500 text-xs mt-1">{errors.payee}</div>}
              </div>
            )}
            {step === 1 && (
              <div className="animate-fade-in-up">
                <label className="block font-semibold mb-2">Amount (IDRX)</label>
                <input ref={inputRef} name="amount" value={form.amount} onChange={handleChange} className="input input-bordered w-full text-lg" placeholder="1000" />
                {errors.amount && <div className="text-red-500 text-xs mt-1">{errors.amount}</div>}
              </div>
            )}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <label className="block font-semibold mb-2">Timeout (seconds, min 60)</label>
                <input ref={inputRef} name="timeout" value={form.timeout} onChange={handleChange} className="input input-bordered w-full text-lg" placeholder="3600" />
                {errors.timeout && <div className="text-red-500 text-xs mt-1">{errors.timeout}</div>}
              </div>
            )}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <label className="block font-semibold mb-2">Milestones</label>
                {form.milestones.map((m, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={m} onChange={e => handleMilestoneChange(i, e.target.value)} className="input input-bordered flex-1 text-lg" placeholder={`Milestone ${i + 1}`} />
                    {form.milestones.length > 1 && <button type="button" className="btn btn-xs btn-error" onClick={() => removeMilestone(i)}>-</button>}
                  </div>
                ))}
                <button type="button" className="btn btn-xs btn-primary mt-2" onClick={addMilestone}>+ Add Milestone</button>
                {errors.milestones && <div className="text-red-500 text-xs mt-1">{errors.milestones}</div>}
              </div>
            )}
            {step === 4 && (
              <div className="animate-fade-in-up text-lg">
                <h2 className="font-bold mb-4 text-blue-700 dark:text-blue-400 text-xl">Review</h2>
                <div className="mb-2"><b>Payee:</b> <span className="text-blue-700 dark:text-blue-400">{form.payee}</span></div>
                <div className="mb-2"><b>Amount:</b> <span className="text-blue-700 dark:text-blue-400">{form.amount} IDRX</span></div>
                <div className="mb-2"><b>Timeout:</b> <span className="text-blue-700 dark:text-blue-400">{form.timeout} seconds</span></div>
                <div className="mb-2"><b>Milestones:</b> <ul className="list-disc ml-6">{form.milestones.map((m, i) => <li key={i}>{m}</li>)}</ul></div>
              </div>
            )}
          </div>

          {/* Stepper Controls */}
          <div className="flex gap-3 mt-8 justify-center">
            {step > 0 && <button type="button" className="btn btn-outline px-6 py-2 text-lg" onClick={prev}>Back</button>}
            {step < 4 && <button type="button" className="btn btn-primary px-8 py-2 text-lg font-bold shadow-lg" onClick={next}>Next</button>}
            {step === 4 && <button type="button" className="btn btn-success px-8 py-2 text-lg font-bold shadow-lg disabled:opacity-60" onClick={submit} disabled={submitting}>{submitting ? "Creating..." : "Create Escrow"}</button>}
          </div>
        </div>
      </section>
    </main>
  );
}
