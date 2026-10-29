// src/modules/planner/DayPlanRow.jsx
import { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import Badge from '../../components/ui/Badge.jsx';
import { formatDate } from '../../data/calculations.js';

export default function DayPlanRow({ plan, channels, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ actual: plan.actual, activity: plan.activity, status: plan.status });

  const ch         = channels.find(c => c.id === plan.channelId);
  const completion = plan.target > 0 ? Math.min((plan.actual / plan.target) * 100, 100) : 0;

  function handleSave() {
    onUpdate(plan.day, { actual: Number(form.actual), activity: form.activity, status: form.status });
    setEditing(false);
  }

  function handleCancel() {
    setForm({ actual: plan.actual, activity: plan.activity, status: plan.status });
    setEditing(false);
  }

  return (
    <tr>
      <td style={{ fontWeight: 600, width: '60px', color: 'var(--color-accent)' }}>Day {plan.day}</td>
      <td style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{formatDate(plan.date)}</td>
      <td>
        {editing ? (
          <input
            type="text"
            value={form.activity}
            onChange={e => setForm(f => ({ ...f, activity: e.target.value }))}
            style={{ width: '100%', fontSize: '13px' }}
          />
        ) : (
          <span style={{ fontSize: '13px' }}>{plan.activity}</span>
        )}
      </td>
      <td style={{ width: '80px', textAlign: 'right', fontWeight: 600 }}>{plan.target}</td>
      <td style={{ width: '100px' }}>
        {editing ? (
          <input
            type="number"
            min="0"
            value={form.actual}
            onChange={e => setForm(f => ({ ...f, actual: e.target.value }))}
            style={{ width: '80px', fontSize: '13px' }}
          />
        ) : (
          <span style={{ fontWeight: 700, color: plan.actual >= plan.target ? 'var(--color-success)' : plan.actual > 0 ? 'var(--color-warning)' : 'var(--color-text-secondary)' }}>
            {plan.actual}
          </span>
        )}
      </td>
      <td style={{ width: '100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ flex: 1, height: '6px', background: 'var(--color-border)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${completion}%`,
              background: completion >= 100 ? 'var(--color-success)' : completion > 0 ? 'var(--color-warning)' : 'var(--color-border)',
              borderRadius: '9999px',
            }} />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', width: '30px', textAlign: 'right' }}>
            {plan.status === 'upcoming' ? '—' : `${Math.round(completion)}%`}
          </span>
        </div>
      </td>
      <td>
        {editing ? (
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ width: 'auto', fontSize: '12px' }}>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
            <option value="missed">Missed</option>
          </select>
        ) : (
          <Badge variant={plan.status}>{plan.status}</Badge>
        )}
      </td>
      <td style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
        {ch?.name.split(' ').slice(0, 2).join(' ') || '—'}
      </td>
      <td>
        {editing ? (
          <div style={{ display: 'flex', gap: '4px' }}>
            <button className="btn btn-sm btn-primary" onClick={handleSave}><Check size={13} /></button>
            <button className="btn btn-sm" onClick={handleCancel}><X size={13} /></button>
          </div>
        ) : (
          <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>
            <Edit2 size={13} />
          </button>
        )}
      </td>
    </tr>
  );
}
