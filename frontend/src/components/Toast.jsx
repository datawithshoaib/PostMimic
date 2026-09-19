import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let bg = 'bg-dark-850/95 border-slate-700/80 text-white shadow-xl shadow-black/40';
        let icon = <Info className="w-5 h-5 text-sky-400 shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-emerald-950/90 border-emerald-500/30 text-emerald-100 shadow-xl shadow-emerald-950/30';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
        } else if (toast.type === 'error') {
          bg = 'bg-rose-950/90 border-rose-500/30 text-rose-100 shadow-xl shadow-rose-950/30';
          icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-right-5 ${bg}`}
          >
            <div className="flex items-center gap-3">
              {icon}
              <p className="text-xs sm:text-sm font-medium leading-tight">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
