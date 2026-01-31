import React from "react";

interface TimelineItem {
  label: string;
  status: "done" | "active" | "pending";
  description?: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <ol className="relative border-l border-blue-200 dark:border-slate-700 ml-4">
      {items.map((item, i) => (
        <li key={i} className="mb-10 ml-6">
          <span
            className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-8 ring-white dark:ring-slate-900 ${
              item.status === "done"
                ? "bg-green-500"
                : item.status === "active"
                ? "bg-blue-600 animate-pulse"
                : "bg-gray-300"
            }`}
          />
          <h3 className="font-bold leading-tight text-blue-700 dark:text-blue-300">{item.label}</h3>
          {item.description && <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>}
        </li>
      ))}
    </ol>
  );
}
