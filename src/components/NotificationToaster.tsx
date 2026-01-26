"use client";
import { useState } from "react";

export function useNotification() {
  const [notifications, setNotifications] = useState<{ type: string; message: string }[]>([]);
  function notify(type: string, message: string) {
    setNotifications((prev) => [...prev, { type, message }]);
    setTimeout(() => setNotifications((prev) => prev.slice(1)), 4000);
  }
  return { notifications, notify };
}

export default function NotificationToaster({ notifications }: { notifications: { type: string; message: string }[] }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3" aria-live="polite" aria-atomic="true">
      {notifications.map((n, i) => (
        <div
          key={i}
          className={`px-5 py-4 rounded-xl shadow-2xl text-base font-semibold animate-fade-in border-2 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all
            ${n.type === "success" ? "bg-success-500/95 text-white border-success-500" : n.type === "error" ? "bg-danger-500/95 text-white border-danger-500" : "bg-brand-500/95 text-white border-brand-500"}
          `}
          tabIndex={0}
          role="alert"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {n.type === "success" ? "✅" : n.type === "error" ? "❌" : "ℹ️"}
            </span>
            <span className="leading-tight break-words">{n.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
