// src/modules/dashboard/DailyTarget.jsx
import Badge from '../../components/ui/Badge.jsx';

export default function DailyTarget({ dayPlan }) {
  const { target, actual, activity, date, status } = dayPlan;
  const completion = target > 0 ? Math.min((actual / target) * 100, 100) : 0;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 0',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div style={{ width: '60px', textAlign: 'right', flexShrink: 0 }}>
        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {activity}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '6px', background: 'var(--color-border)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${completion}%`,
              background: status === 'completed' ? 'var(--color-success)' : 'var(--color-accent)',
              borderRadius: '9999px',
            }} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, width: '60px', textAlign: 'right', flexShrink: 0 }}>
            {status === 'upcoming' ? `0/${target}` : `${actual}/${target}`}
          </span>
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>
        <Badge variant={status}>{status}</Badge>
      </div>
    </div>
  );
}
