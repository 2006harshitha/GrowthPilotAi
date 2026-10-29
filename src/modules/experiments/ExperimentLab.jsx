// src/modules/experiments/ExperimentLab.jsx
import { useState } from 'react';
import { Plus, Info, FlaskConical } from 'lucide-react';
import { useAppStore, useToastCtx } from '../../store/useAppStore.jsx';
import VariantCard from './VariantCard.jsx';
import ExperimentForm from './ExperimentForm.jsx';
import ExperimentComparisonChart from '../../components/charts/ExperimentComparisonChart.jsx';
import Badge from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { getConversionRate, formatPercent } from '../../data/calculations.js';

function ExperimentPanel({ experiment, onEdit }) {
  const [compareMetric, setMetric] = useState('conv');
  const [editFormOpen, setEditForm] = useState(false);
  const { dispatch } = useAppStore();
  const { addToast } = useToastCtx();

  const [a, b] = experiment.variants || [];
  const convA = a ? getConversionRate(a.registrations, a.clicks) : 0;
  const convB = b ? getConversionRate(b.registrations, b.clicks) : 0;

  const winner = convB > convA ? b : convA > convB ? a : null;
  const diff   = Math.abs(convB - convA);

  function handleSave(data) {
    dispatch({ type: 'UPDATE_EXPERIMENT', payload: data });
    addToast(`Experiment "${data.name}" updated.`, 'success');
    setEditForm(false);
  }

  return (
    <div className="card mb-6">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FlaskConical size={16} style={{ color: 'var(--color-accent)' }} />
          <span className="card-title">{experiment.name}</span>
          <Badge variant={experiment.status === 'running' ? 'running' : 'neutral'}>
            {experiment.status}
          </Badge>
          {experiment.isSimulated && <Badge variant="amber">Simulated Data</Badge>}
        </div>
        <button className="btn btn-sm" onClick={() => setEditForm(true)}>Edit</button>
      </div>

      {/* Disclaimer */}
      <div style={{
        margin: '0 20px',
        marginTop: '16px',
        padding: '10px 14px',
        background: '#FEF3C7',
        border: '1px solid #FDE68A',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#78350F',
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-start',
      }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
        <span>
          <strong>Important:</strong> {experiment.disclaimer} These observations are directional. A reliable A/B test requires an appropriate sample size (~100+ per variant) and controlled audience allocation.
        </span>
      </div>

      <div className="card-body">
        {/* Variant Cards */}
        <div className="two-col mb-6" style={{ marginTop: '8px' }}>
          {experiment.variants.map(v => (
            <VariantCard
              key={v.id}
              variant={v}
              isWinner={winner?.id === v.id}
            />
          ))}
        </div>

        {/* Comparison Summary */}
        {winner && (
          <div style={{
            padding: '14px 16px',
            background: '#F0FDF4',
            border: '1px solid #A7F3D0',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '13px',
          }}>
            <strong style={{ color: '#065F46' }}>Directional observation:</strong>
            <span style={{ color: '#064E3B' }}>
              {' '}{winner.label} shows {formatPercent(diff)} higher click-to-registration rate
              ({formatPercent(winner === b ? convB : convA)} vs {formatPercent(winner === b ? convA : convB)}).
              This is a directional signal only — not statistically significant.
            </span>
          </div>
        )}

        {/* Chart */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Performance Comparison</span>
          </div>
          <ExperimentComparisonChart variants={experiment.variants} />
        </div>
      </div>

      <ExperimentForm
        isOpen={editFormOpen}
        onClose={() => setEditForm(false)}
        experiment={experiment}
        onSave={handleSave}
      />
    </div>
  );
}

export default function ExperimentLab() {
  const { state, dispatch } = useAppStore();
  const { addToast }        = useToastCtx();
  const { experiments }     = state;
  const [newFormOpen, setNewForm] = useState(false);

  function handleCreateExperiment(data) {
    dispatch({ type: 'ADD_EXPERIMENT', payload: data });
    addToast(`Experiment "${data.name}" created.`, 'success');
    setNewForm(false);
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="section-title">Experiment Lab</h2>
          <p className="section-subtitle">Compare message variants. Results are directional — not statistically validated.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setNewForm(true)}>
          <Plus size={14} /> New Experiment
        </button>
      </div>

      {experiments.length === 0 ? (
        <EmptyState
          icon={<FlaskConical size={40} />}
          title="No experiments yet"
          description="Create your first A/B test to compare message variants."
          action={
            <button className="btn btn-primary" onClick={() => setNewForm(true)}>
              <Plus size={14} /> New Experiment
            </button>
          }
        />
      ) : (
        experiments.map(exp => (
          <ExperimentPanel key={exp.id} experiment={exp} />
        ))
      )}

      <ExperimentForm
        isOpen={newFormOpen}
        onClose={() => setNewForm(false)}
        experiment={null}
        onSave={handleCreateExperiment}
      />
    </div>
  );
}
