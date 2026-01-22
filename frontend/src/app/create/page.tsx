
"use client";
import { useState } from "react";

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

  function validateStep() {
    const errs: any = {};
    if (step === 0 && !form.payee) errs.payee = "Payee address required";
    if (step === 1 && (!form.amount || isNaN(Number(form.amount)))) errs.amount = "Valid amount required";
    if (step === 2 && (!form.timeout || isNaN(Number(form.timeout)))) errs.timeout = "Valid timeout required";
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
    // TODO: Integrate with contract, wallet, etc.
    setTimeout(() => {
      setSubmitting(false);
      alert("Escrow created! (Integrate with contract)");
    }, 1200);
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-20 px-4 animate-fade-in-up">
      <h1 className="text-4xl font-extrabold mb-10 text-blue-700 dark:text-blue-400 text-center drop-shadow-xl">Create Escrow</h1>
      <div className="bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl p-10 flex flex-col gap-10 border border-blue-100 dark:border-blue-900">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-9 h-9 flex items-center justify-center rounded-full font-bold text-lg border-2 transition-all duration-300
                ${step === i ? "bg-blue-700 text-white border-blue-700 scale-110 shadow-lg" : step > i ? "bg-blue-100 dark:bg-blue-900 text-blue-700 border-blue-400" : "bg-gray-200 dark:bg-gray-800 text-gray-400 border-gray-300"}`}>{i + 1}</div>
              {i < steps.length - 1 && <div className="w-10 h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 dark:from-blue-900 dark:via-blue-700 dark:to-blue-900 mx-1 rounded-full" />}
            </div>
          ))}
        </div>
        <div className="text-center text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2 transition-all min-h-[28px]">{steps[step].label}</div>
        <div className="text-center text-gray-500 dark:text-gray-400 mb-6 min-h-[20px]">{steps[step].desc}</div>

        {/* Step Content */}
        {step === 0 && (
          <div>
            <label className="block font-semibold mb-2">Payee Address</label>
            <input name="payee" value={form.payee} onChange={handleChange} className="input input-bordered w-full text-lg" placeholder="0x..." autoFocus />
            {errors.payee && <div className="text-red-500 text-xs mt-1">{errors.payee}</div>}
          </div>
        )}
        {step === 1 && (
          <div>
            <label className="block font-semibold mb-2">Amount (IDRX)</label>
            <input name="amount" value={form.amount} onChange={handleChange} className="input input-bordered w-full text-lg" placeholder="1000" />
            {errors.amount && <div className="text-red-500 text-xs mt-1">{errors.amount}</div>}
          </div>
        )}
        {step === 2 && (
          <div>
            <label className="block font-semibold mb-2">Timeout (seconds)</label>
            <input name="timeout" value={form.timeout} onChange={handleChange} className="input input-bordered w-full text-lg" placeholder="3600" />
            {errors.timeout && <div className="text-red-500 text-xs mt-1">{errors.timeout}</div>}
          </div>
        )}
        {step === 3 && (
          <div>
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
          <div className="text-lg">
            <h2 className="font-bold mb-4 text-blue-700 dark:text-blue-400 text-xl">Review</h2>
            <div className="mb-2"><b>Payee:</b> <span className="text-blue-700 dark:text-blue-400">{form.payee}</span></div>
            <div className="mb-2"><b>Amount:</b> <span className="text-blue-700 dark:text-blue-400">{form.amount} IDRX</span></div>
            <div className="mb-2"><b>Timeout:</b> <span className="text-blue-700 dark:text-blue-400">{form.timeout} seconds</span></div>
            <div className="mb-2"><b>Milestones:</b> <ul className="list-disc ml-6">{form.milestones.map((m, i) => <li key={i}>{m}</li>)}</ul></div>
          </div>
        )}

        {/* Stepper Controls */}
        <div className="flex gap-3 mt-8 justify-center">
          {step > 0 && <button type="button" className="btn btn-outline px-6 py-2 text-lg" onClick={prev}>Back</button>}
          {step < 4 && <button type="button" className="btn btn-primary px-8 py-2 text-lg font-bold shadow-lg" onClick={next}>Next</button>}
          {step === 4 && <button type="button" className="btn btn-success px-8 py-2 text-lg font-bold shadow-lg disabled:opacity-60" onClick={submit} disabled={submitting}>{submitting ? "Creating..." : "Create Escrow"}</button>}
        </div>
      </div>
    </div>
  );
}
