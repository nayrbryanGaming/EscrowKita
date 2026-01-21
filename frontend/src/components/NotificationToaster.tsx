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
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {notifications.map((n, i) => (
        <div key={i} className={`px-4 py-3 rounded-lg shadow-lg text-sm animate-fade-in ${n.type === "success" ? "bg-success-500 text-white" : n.type === "error" ? "bg-danger-500 text-white" : "bg-brand-500 text-white"}`}>
          <div className="flex items-center gap-2">
            <div className="text-lg">{n.type === "success" ? "✅" : n.type === "error" ? "❌" : "ℹ️"}</div>
            <div className="leading-tight">{n.message}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
