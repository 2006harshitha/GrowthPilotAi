// src/components/ui/KPICard.jsx
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KPICard({
  icon,
  label,
  value,
  subtitle,
  trend,        // { value: number, label: string } — positive means up
  accentColor,  // override accent border color
  loading,
}) {
  const accent = accentColor || 'var(--color-accent)';

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
      padding: '18px 20px',
      borderTop: `3px solid ${accent}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--color-text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {label}
        </span>
        {icon && (
          <span style={{ color: accent, opacity: 0.7 }}>
            {icon}
          </span>
        )}
      </div>

      {loading ? (
        <div style={{ height: '28px', background: '#F1F5F9', borderRadius: '4px', width: '60%' }} />
      ) : (
        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}>
          {value}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', minHeight: '18px' }}>
        {subtitle && (
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {subtitle}
          </span>
        )}
        {trend !== undefined && trend !== null && (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            fontSize: '12px',
            fontWeight: 600,
            color: trend.value >= 0 ? 'var(--color-success)' : 'var(--color-error)',
          }}>
            {trend.value >= 0
              ? <TrendingUp size={13} />
              : <TrendingDown size={13} />
            }
            {trend.label || `${Math.abs(trend.value).toFixed(1)}%`}
          </span>
        )}
      </div>
    </div>
  );
}
