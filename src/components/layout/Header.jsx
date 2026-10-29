// src/components/layout/Header.jsx
import { useState } from 'react';
import { Download, RotateCcw, AlertTriangle } from 'lucide-react';
import { useAppStore, useToastCtx } from '../../store/useAppStore.jsx';
import { exportRegistrationsCSV } from '../../data/csvExport.js';
import Modal from '../ui/Modal.jsx';

const PAGE_TITLES = {
  dashboard:   'Growth Command Center',
  channels:    'Channel Analytics',
  ambassadors: 'Ambassador Program',
  experiments: 'Experiment Lab',
  advisor:     'AI Growth Advisor',
  planner:     'Campaign Planner',
  simulator:   'Scenario Simulator',
};

export default function Header({ currentPage }) {
  const { state, dispatch } = useAppStore();
  const { addToast }        = useToastCtx();
  const [resetOpen, setResetOpen] = useState(false);

  function handleExport() {
    exportRegistrationsCSV(state.registrations, state.channels);
    addToast('Registrations exported as CSV.', 'success');
  }

  function handleReset() {
    dispatch({ type: 'RESET_TO_SEED' });
    setResetOpen(false);
    addToast('Data reset to seed state.', 'info');
  }

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 24px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 50,
        gap: '16px',
      }}>
        {/* Left: page title */}
        <h1 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          {PAGE_TITLES[currentPage] || 'GrowthPilot AI'}
        </h1>

        {/* Center: demo badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#FEF3C7',
          border: '1px solid #FDE68A',
          borderRadius: '9999px',
          padding: '4px 12px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#78350F',
          letterSpacing: '0.05em',
        }}>
          <AlertTriangle size={12} />
          DEMO DATA — SIMULATED CAMPAIGN
        </div>

        {/* Right: actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn btn-sm" onClick={handleExport} title="Export registrations as CSV">
            <Download size={14} />
            Export CSV
          </button>
          <button
            className="btn btn-sm"
            onClick={() => setResetOpen(true)}
            title="Reset all data to seed state"
            style={{ color: 'var(--color-error)', borderColor: '#FECACA' }}
          >
            <RotateCcw size={14} />
            Reset Data
          </button>
        </div>
      </header>

      <Modal
        isOpen={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset All Data?"
        confirmLabel="Reset to Seed Data"
        onConfirm={handleReset}
        danger
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            This will discard all changes you have made — added registrations, ambassadors, experiments, and channel edits — and restore the original simulated seed data.
          </p>
          <p style={{ fontSize: '13px', color: 'var(--color-error)', fontWeight: 600 }}>
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </>
  );
}
