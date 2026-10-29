// src/components/ui/Tooltip.jsx
import { useState } from 'react';

export default function Tooltip({ content, children, placement = 'top' }) {
  const [visible, setVisible] = useState(false);

  const positions = {
    top:    { bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top:    'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' },
    right:  { left:   'calc(100% + 6px)', top: '50%',  transform: 'translateY(-50%)' },
    left:   { right:  'calc(100% + 6px)', top: '50%',  transform: 'translateY(-50%)' },
  };

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <span style={{
          position: 'absolute',
          ...positions[placement],
          background: '#1E293B',
          color: '#F8FAFC',
          fontSize: '12px',
          lineHeight: 1.4,
          padding: '6px 10px',
          borderRadius: '6px',
          whiteSpace: 'nowrap',
          maxWidth: '240px',
          whiteSpaceCollapse: 'collapse',
          zIndex: 999,
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}>
          {content}
        </span>
      )}
    </span>
  );
}
