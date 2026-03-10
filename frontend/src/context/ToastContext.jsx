import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ToastContainer from "../components/ToastContainer";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((options) => {
    const id = crypto.randomUUID();

    const toast = {
      id,
      type: options.type || "info",
      title: options.title || "Bilgilendirme",
      message: options.message || "",
      duration: options.duration || 3500,
    };

    setToasts((prev) => [...prev, toast]);
    return id;
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      removeToast,
    }),
    [showToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}