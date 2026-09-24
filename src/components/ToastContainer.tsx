import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, X, ShieldAlert } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';
        const is42501 = toast.code === '42501';

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl transition-all duration-300 transform translate-y-0 border ${
              isError
                ? is42501
                  ? 'bg-rose-50 border-rose-200 text-rose-900 shadow-rose-200/50'
                  : 'bg-amber-50 border-amber-200 text-amber-900 shadow-amber-200/50'
                : isSuccess
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-emerald-200/50'
                : 'bg-purple-50 border-purple-200 text-purple-900 shadow-purple-200/50'
            }`}
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.8)'
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {isError ? (
                  is42501 ? (
                    <div className="p-1.5 bg-rose-200/70 rounded-xl text-rose-700">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="p-1.5 bg-amber-200/70 rounded-xl text-amber-700">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  )
                ) : isSuccess ? (
                  <div className="p-1.5 bg-emerald-200/70 rounded-xl text-emerald-700">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="p-1.5 bg-purple-200/70 rounded-xl text-purple-700">
                    <Info className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold tracking-tight">{toast.title}</h4>
                  {toast.code && (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-black/10 rounded-full">
                      {toast.code}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-700 break-words">
                  {toast.message}
                </p>
              </div>

              <button
                id={`btn-close-toast-${toast.id}`}
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
                aria-label="Cerrar notificación"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
