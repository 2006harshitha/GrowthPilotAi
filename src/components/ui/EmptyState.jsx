// src/components/ui/EmptyState.jsx
import { Inbox } from 'lucide-react';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      color: 'var(--color-text-secondary)',
      textAlign: 'center',
      gap: '12px',
    }}>
      <span style={{ color: 'var(--color-border)', opacity: 0.8 }}>
        {icon || <Inbox size={40} />}
      </span>
      <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
        {title || 'No data yet'}
      </h4>
      {description && (
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', maxWidth: '320px' }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: '8px' }}>{action}</div>}
    </div>
  );
}
