// src/modules/advisor/AIGrowthAdvisor.jsx
import { useState } from 'react';
import { Brain, RefreshCw, Info } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore.jsx';
import RecommendationCard from './RecommendationCard.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { generateRecommendations } from '../../data/recommendations.js';

export default function AIGrowthAdvisor() {
  const { state }  = useAppStore();
  const [refreshed, setRefreshed] = useState(false);

  const recommendations = generateRecommendations(state);

  const high   = recommendations.filter(r => r.priority === 'high');
  const medium = recommendations.filter(r => r.priority === 'medium');
  const low    = recommendations.filter(r => r.priority === 'low');

  function handleRefresh() {
    setRefreshed(true);
    setTimeout(() => setRefreshed(false), 1500);
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="section-title">AI Growth Advisor</h2>
          <p className="section-subtitle">Rule-based recommendations from your live campaign data. No LLM required.</p>
        </div>
        <button className="btn" onClick={handleRefresh} disabled={refreshed}>
          <RefreshCw size={14} className={refreshed ? 'spin' : ''} />
          {refreshed ? 'Updated' : 'Refresh'}
        </button>
      </div>

      {/* How it works */}
      <div style={{
        background: 'var(--color-accent-light)',
        border: '1px solid #C7D2FE',
        borderRadius: '8px',
        padding: '14px 16px',
        marginBottom: '24px',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
      }}>
        <Brain size={16} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '1px' }} />
        <div style={{ fontSize: '13px', color: '#312E81', lineHeight: 1.5 }}>
          <strong>How this works:</strong> The advisor examines your current campaign metrics (channels, conversions, budget, ambassador data, and experiment results) and applies deterministic rules to surface actionable recommendations. Recommendations update whenever the underlying data changes.
        </div>
      </div>

      {recommendations.length === 0 ? (
        <EmptyState
          icon={<Brain size={40} />}
          title="No recommendations yet"
          description="Add channel and registration data to receive data-driven recommendations."
        />
      ) : (
        <>
          {high.length > 0 && (
            <div className="mb-6">
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-error)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🔴 High Priority ({high.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {high.map(r => <RecommendationCard key={r.id} rec={r} />)}
              </div>
            </div>
          )}
          {medium.length > 0 && (
            <div className="mb-6">
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-warning)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🟡 Medium Priority ({medium.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {medium.map(r => <RecommendationCard key={r.id} rec={r} />)}
              </div>
            </div>
          )}
          {low.length > 0 && (
            <div className="mb-6">
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🔵 Low Priority ({low.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {low.map(r => <RecommendationCard key={r.id} rec={r} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
