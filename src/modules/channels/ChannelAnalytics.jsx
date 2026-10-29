// src/modules/channels/ChannelAnalytics.jsx
import { useState } from 'react';
import { Plus, Edit2, Info } from 'lucide-react';
import { useAppStore, useToastCtx } from '../../store/useAppStore.jsx';
import ChannelForm from './ChannelForm.jsx';
import Tooltip from '../../components/ui/Tooltip.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { getChannelStats, formatCurrency, formatPercent, safeDivide } from '../../data/calculations.js';

function MetricWithTooltip({ label, value, tip }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </span>
        {tip && (
          <Tooltip content={tip}>
            <Info size={11} style={{ color: 'var(--color-text-secondary)', cursor: 'help' }} />
          </Tooltip>
        )}
      </div>
      <div style={{ fontWeight: 700, fontSize: '15px' }}>{value}</div>
    </div>
  );
}

function ChannelCard({ channel, registrations, onEdit }) {
  const stats = getChannelStats(channel, registrations);

  const typeColors = {
    community: 'info',
    ambassador: 'success',
    paid: 'warning',
    organic: 'neutral',
  };

  return (
    <div className="card" style={{ borderTop: `3px solid ${channel.color || 'var(--color-accent)'}` }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: channel.color || 'var(--color-accent)', flexShrink: 0,
          }} />
          <span className="card-title" style={{ fontSize: '13px' }}>{channel.name}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Badge variant={typeColors[channel.type] || 'neutral'}>{channel.type}</Badge>
          <button className="btn btn-ghost btn-sm" onClick={() => onEdit(channel)}>
            <Edit2 size={13} /> Edit
          </button>
        </div>
      </div>
      <div className="card-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
          <MetricWithTooltip
            label="Reach"
            value={stats.reach.toLocaleString()}
            tip="Estimated total audience who could have seen the message. Not measured clicks."
          />
          <MetricWithTooltip
            label="Clicks"
            value={stats.clicks.toLocaleString()}
            tip="Measured unique link clicks tracked from this channel."
          />
          <MetricWithTooltip
            label="Registrations"
            value={stats.registrations.toLocaleString()}
            tip="Unique registrations attributed to this channel."
          />
          <MetricWithTooltip
            label="Spend"
            value={formatCurrency(stats.spend)}
            tip="Total budget spent on this channel."
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <MetricWithTooltip
            label="CTR"
            value={formatPercent(stats.ctr)}
            tip="Click-Through Rate = Clicks ÷ Reach × 100. Note: reach is estimated, so CTR is approximate."
          />
          <MetricWithTooltip
            label="Conv. Rate"
            value={formatPercent(stats.conversionRate)}
            tip="Click-to-Registration Rate = Registrations ÷ Clicks × 100. Measures landing page + form effectiveness."
          />
          <MetricWithTooltip
            label="CPR"
            value={stats.spend > 0 && stats.registrations > 0 ? formatCurrency(Math.round(stats.cpr)) : '—'}
            tip="Cost Per Registration = Spend ÷ Registrations. Only meaningful for channels with spend > 0."
          />
          <MetricWithTooltip
            label="Share"
            value={formatPercent(stats.share)}
            tip="This channel's contribution to total registrations."
          />
        </div>
        {/* Mini progress */}
        <div style={{ marginTop: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Funnel drop-off</span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
              {stats.registrations} of {stats.clicks} clicks converted
            </span>
          </div>
          <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(stats.conversionRate, 100)}%`,
              background: channel.color || 'var(--color-accent)',
              borderRadius: '9999px',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChannelAnalytics() {
  const { state, dispatch } = useAppStore();
  const { addToast }        = useToastCtx();
  const { channels, registrations } = state;
  const [formOpen, setFormOpen] = useState(false);
  const [editing,  setEditing]  = useState(null);

  function handleAdd() { setEditing(null); setFormOpen(true); }
  function handleEdit(ch) { setEditing(ch); setFormOpen(true); }
  function handleSave(data) {
    if (editing) {
      dispatch({ type: 'UPDATE_CHANNEL', payload: data });
      addToast(`Channel "${data.name}" updated.`, 'success');
    } else {
      dispatch({ type: 'ADD_CHANNEL', payload: data });
      addToast(`Channel "${data.name}" added.`, 'success');
    }
  }

  const totalReach = channels.reduce((s, c) => s + c.reach, 0);
  const totalClicks = channels.reduce((s, c) => s + c.clicks, 0);
  const totalSpend = channels.reduce((s, c) => s + c.spend, 0);
  const totalRegs = registrations.length;

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="section-title">Channel Analytics</h2>
          <p className="section-subtitle">Track performance across all acquisition channels.</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={15} /> Add Channel
        </button>
      </div>

      {/* Summary row */}
      <div className="kpi-grid mb-6">
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Total Reach</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{totalReach.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Estimated</div>
        </div>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Total Clicks</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{totalClicks.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Measured</div>
        </div>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Total Registrations</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{totalRegs.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Unique</div>
        </div>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Total Spend</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{formatCurrency(totalSpend)}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>All channels</div>
        </div>
      </div>

      {/* Channel Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {channels.map(ch => (
          <ChannelCard
            key={ch.id}
            channel={ch}
            registrations={registrations}
            onEdit={handleEdit}
          />
        ))}
      </div>

      <ChannelForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        channel={editing}
        onSave={handleSave}
      />
    </div>
  );
}
