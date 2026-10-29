// src/components/ui/Badge.jsx

const variants = {
  success: { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
  warning: { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
  error:   { bg: '#FEE2E2', color: '#7F1D1D', border: '#FECACA' },
  info:    { bg: '#EEF2FF', color: '#3730A3', border: '#C7D2FE' },
  neutral: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' },
  amber:   { bg: '#FEF3C7', color: '#78350F', border: '#FDE68A' },
  demo:    { bg: '#FEF3C7', color: '#78350F', border: '#FDE68A' },
  active:  { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
  inactive:{ bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' },
  running: { bg: '#EEF2FF', color: '#3730A3', border: '#C7D2FE' },
  completed:{ bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
  upcoming: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' },
};

export default function Badge({ children, variant = 'neutral', style: extraStyle }) {
  const v = variants[variant] || variants.neutral;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: '9999px',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.02em',
      background: v.bg,
      color: v.color,
      border: `1px solid ${v.border}`,
      whiteSpace: 'nowrap',
      ...extraStyle,
    }}>
      {children}
    </span>
  );
}
