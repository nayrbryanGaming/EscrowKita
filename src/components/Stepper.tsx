import React from "react";

interface StepperProps {
  steps: string[];
  current: number;
}

export default function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-4 w-full mb-8">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-lg border-2 transition-all ${
              i < current
                ? "bg-blue-700 text-white border-blue-700"
                : i === current
                ? "bg-white text-blue-700 border-blue-700"
                : "bg-gray-200 text-gray-400 border-gray-300"
            }`}
          >
            {i + 1}
          </div>
          <span className={`text-sm font-semibold ${i === current ? "text-blue-700" : "text-gray-400"}`}>{step}</span>
          {i < steps.length - 1 && <div className="w-8 h-1 bg-gray-300 rounded" />}
        </div>
      ))}
    </div>
  );
}
