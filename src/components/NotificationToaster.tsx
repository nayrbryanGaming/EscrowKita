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
          className={`px-5 py-4 rounded-xl shadow-lg text-base font-semibold animate-fade-in border-2 transition-all
            ${n.type === "success" ? "bg-success text-white border-success" : n.type === "error" ? "bg-danger text-white border-danger" : "bg-primary text-white border-primary"}
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
