"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error";

export type ToastData = {
  id: number;
  message: string;
  type: ToastType;
};

export default function Toast({
  toast,
  onRemove,
}: {
  toast: ToastData;
  onRemove: (id: number) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className={`pointer-events-auto rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      {toast.message}
    </div>
  );
}
