import React from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
}

export default function Toast({ message, type = "info" }: ToastProps) {
  const color =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600";
  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl text-white shadow-lg font-semibold ${color}`}>
      {message}
    </div>
  );
}
