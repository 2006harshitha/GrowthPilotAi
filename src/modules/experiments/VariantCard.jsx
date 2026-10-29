// src/modules/experiments/VariantCard.jsx
import { MessageSquare, Users, MousePointerClick, UserCheck, TrendingUp } from 'lucide-react';
import Badge from '../../components/ui/Badge.jsx';
import Tooltip from '../../components/ui/Tooltip.jsx';
import { getCTR, getConversionRate, safeDivide, formatPercent } from '../../data/calculations.js';

function Metric({ label, value, tip, highlight }) {
  return (
    <div style={{
      background: highlight ? 'var(--color-accent-light)' : 'var(--color-bg)',
      borderRadius: '6px',
      padding: '10px 12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </span>
        {tip && <Tooltip content={tip}><span style={{ cursor: 'help', color: 'var(--color-text-secondary)', fontSize: '11px' }}>?</span></Tooltip>}
      </div>
      <div style={{ fontWeight: 700, fontSize: '18px', color: highlight ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>
        {value}
      </div>
    </div>
  );
}

export default function VariantCard({ variant, isWinner, onEdit }) {
  const ctr  = getCTR(variant.clicks, variant.reach);
  const conv = getConversionRate(variant.registrations, variant.clicks);
  const regRate = safeDivide(variant.registrations, variant.reach) * 100;

  return (
    <div className="card" style={{
      borderTop: `3px solid ${isWinner ? 'var(--color-success)' : 'var(--color-border)'}`,
    }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="card-title">{variant.label}</span>
          {isWinner && <Badge variant="success">Leading</Badge>}
          {variant.isSimulated && <Badge variant="amber">Simulated</Badge>}
        </div>
        {onEdit && (
          <button className="btn btn-ghost btn-sm" onClick={onEdit}>
            Edit
          </button>
        )}
      </div>
      <div className="card-body">
        {/* Message preview */}
        <div style={{
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderLeft: `3px solid ${isWinner ? 'var(--color-success)' : 'var(--color-accent)'}`,
          borderRadius: '6px',
          padding: '12px 14px',
          fontSize: '13px',
          fontStyle: 'italic',
          color: 'var(--color-text-primary)',
          marginBottom: '16px',
          lineHeight: 1.5,
        }}>
          "{variant.message}"
        </div>

        {/* Metrics grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <Metric
            label="Audience Reach"
            value={variant.reach.toLocaleString()}
            tip="Total audience size this variant was shown to."
          />
          <Metric
            label="Link Clicks"
            value={variant.clicks.toLocaleString()}
            tip="Number of people who clicked the registration link."
          />
          <Metric
            label="Registrations"
            value={variant.registrations.toLocaleString()}
            tip="Number of people who completed registration."
            highlight={isWinner}
          />
          <Metric
            label="CTR"
            value={formatPercent(ctr)}
            tip="Click-Through Rate = Clicks ÷ Reach × 100"
          />
          <Metric
            label="Conv. Rate"
            value={formatPercent(conv)}
            tip="Click-to-Registration = Registrations ÷ Clicks × 100"
            highlight={isWinner}
          />
          <Metric
            label="Reg. Rate"
            value={formatPercent(regRate)}
            tip="Registration Rate = Registrations ÷ Reach × 100"
          />
        </div>
      </div>
    </div>
  );
}
