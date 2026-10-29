// src/components/ui/Toast.jsx
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastCtx } from '../../store/useAppStore.jsx';

const icons = {
  success: <CheckCircle size={16} />,
  error:   <XCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info:    <Info size={16} />,
};

const colors = {
  success: { border: '#10B981', bg: '#F0FDF4', text: '#065F46' },
  error:   { border: '#EF4444', bg: '#FEF2F2', text: '#7F1D1D' },
  warning: { border: '#F59E0B', bg: '#FFFBEB', text: '#78350F' },
  info:    { border: '#6366F1', bg: '#EEF2FF', text: '#312E81' },
};

function ToastItem({ toast, onRemove }) {
  const c = colors[toast.type] || colors.info;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        background: c.bg,
        borderLeft: `4px solid ${c.border}`,
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        color: c.text,
        fontSize: '13px',
        fontWeight: 500,
        maxWidth: '360px',
        animation: 'slideIn 0.2s ease',
        marginBottom: '8px',
      }}
    >
      <span style={{ color: c.border, flexShrink: 0 }}>{icons[toast.type]}</span>
      <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          color: c.text,
          cursor: 'pointer',
          padding: 0,
          opacity: 0.6,
          flexShrink: 0,
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function Toast() {
  const { toasts, removeToast } = useToastCtx();
  if (!toasts.length) return null;
  return createPortal(
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'all' }}>
          <ToastItem toast={t} onRemove={removeToast} />
        </div>
      ))}
    </div>,
    document.body
  );
}
