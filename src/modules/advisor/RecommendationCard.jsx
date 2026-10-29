// src/modules/advisor/RecommendationCard.jsx
import {
  TrendingUp, TrendingDown, AlertTriangle, AlertCircle,
  Target, FlaskConical, Sparkles, Clock,
} from 'lucide-react';
import Badge from '../../components/ui/Badge.jsx';

const ICONS = {
  TrendingUp, TrendingDown, AlertTriangle, AlertCircle,
  Target, FlaskConical, Sparkles, Clock,
};

const PRIORITY_CONFIG = {
  high:   { color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', label: 'High' },
  medium: { color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', label: 'Medium' },
  low:    { color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE', label: 'Low' },
};

export default function RecommendationCard({ rec }) {
  const cfg  = PRIORITY_CONFIG[rec.priority] || PRIORITY_CONFIG.low;
  const Icon = ICONS[rec.icon] || AlertCircle;

  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${cfg.border}`,
      borderLeft: `4px solid ${cfg.color}`,
      borderRadius: '8px',
      padding: '16px 18px',
      boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{
          width: '36px', height: '36px',
          background: cfg.bg,
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: cfg.color,
          flexShrink: 0,
        }}>
          <Icon size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '14px' }}>{rec.title}</span>
            <Badge variant={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'info'}>
              {cfg.label} Priority
            </Badge>
            {rec.metric && (
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                color: cfg.color,
                background: cfg.bg,
                padding: '2px 8px',
                borderRadius: '9999px',
              }}>
                {rec.metric}: {rec.value}
              </span>
            )}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px', lineHeight: 1.5 }}>
            {rec.description}
          </p>
          <div style={{
            fontSize: '13px',
            fontWeight: 600,
            color: cfg.color,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span>→</span>
            <span>{rec.action}</span>
          </div>
          {rec.confidence && (
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
              Confidence: {rec.confidence}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
