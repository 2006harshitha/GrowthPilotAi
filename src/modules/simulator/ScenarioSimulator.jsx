// src/modules/simulator/ScenarioSimulator.jsx
import { useState } from 'react';
import { Sliders, Calculator } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore.jsx';
import {
  safeDivide, getCPR, getConversionRate,
  formatCurrency, formatPercent,
} from '../../data/calculations.js';

function SliderInput({ label, value, min, max, step = 1, onChange, format }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 0 }}>
          {label}
        </label>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-accent)' }}>
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--color-accent)' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{format ? format(min) : min}</span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

function ResultCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: accent ? 'var(--color-accent-light)' : 'var(--color-bg)',
      border: '1px solid var(--color-border)',
      borderRadius: '6px',
      padding: '14px 16px',
    }}>
      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '20px', fontWeight: 700, color: accent ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{sub}</div>}
    </div>
  );
}

export default function ScenarioSimulator() {
  const { state } = useAppStore();
  const { campaign, transactions } = state;

  const totalSpent  = transactions.reduce((s, t) => s + t.amount, 0);
  const budgetLeft  = campaign.budget - totalSpent;

  const [whatsappReach,    setWR] = useState(10000);
  const [whatsappConv,     setWC] = useState(12);   // % CTR
  const [ambCount,         setAC] = useState(10);
  const [ambRegsEach,      setAR] = useState(20);
  const [linkedinBudget,   setLB] = useState(Math.min(budgetLeft, 500));
  const [linkedinCPR,      setLP] = useState(25);   // ₹ per reg

  // Computed projections
  const whatsappRegs   = Math.round(whatsappReach * (whatsappConv / 100) * 0.15); // 15% click-to-reg
  const ambRegs        = ambCount * ambRegsEach;
  const linkedinRegs   = linkedinCPR > 0 ? Math.floor(linkedinBudget / linkedinCPR) : 0;
  const totalProjected = whatsappRegs + ambRegs + linkedinRegs;
  const currentRegs    = state.registrations.length;
  const combinedRegs   = currentRegs + totalProjected;
  const gapToClosed    = combinedRegs >= campaign.target;
  const totalCost      = linkedinBudget;
  const projCPR        = totalProjected > 0 ? totalCost / totalProjected : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="section-title">Scenario Simulator</h2>
        <p className="section-subtitle">Adjust sliders to project how additional outreach could close the registration gap. All values are estimates.</p>
      </div>

      <div className="two-col">
        {/* Left: Inputs */}
        <div>
          <div className="card mb-6">
            <div className="card-header">
              <span className="card-title">Current State</span>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <ResultCard label="Registrations" value={currentRegs} sub={`of ${campaign.target} target`} />
                <ResultCard label="Budget Remaining" value={formatCurrency(budgetLeft)} sub="Available to spend" />
                <ResultCard label="Days Remaining" value={state.dailyPlan.filter(d => d.status === 'upcoming').length} sub="Upcoming days" />
                <ResultCard label="Gap to Target" value={Math.max(0, campaign.target - currentRegs)} sub="Registrations needed" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <Sliders size={16} style={{ color: 'var(--color-accent)' }} />
              <span className="card-title" style={{ marginLeft: '6px' }}>Adjust Scenario</span>
            </div>
            <div className="card-body">
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                WhatsApp & Telegram
              </h4>
              <SliderInput label="Additional Reach" value={whatsappReach} min={0} max={50000} step={500} onChange={setWR} />
              <SliderInput label="CTR %" value={whatsappConv} min={1} max={30} step={1} onChange={setWC} format={v => `${v}%`} />

              <hr className="divider" />
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Ambassador Outreach
              </h4>
              <SliderInput label="Additional Ambassadors" value={ambCount} min={0} max={50} step={1} onChange={setAC} />
              <SliderInput label="Registrations per Ambassador" value={ambRegsEach} min={1} max={50} step={1} onChange={setAR} />

              <hr className="divider" />
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                LinkedIn / Paid
              </h4>
              <SliderInput
                label="Additional Budget (₹)"
                value={linkedinBudget}
                min={0}
                max={Math.max(campaign.budget, 5000)}
                step={100}
                onChange={setLB}
                format={v => formatCurrency(v)}
              />
              <SliderInput label="Target CPR (₹)" value={linkedinCPR} min={5} max={200} step={5} onChange={setLP} format={v => `₹${v}`} />
            </div>
          </div>
        </div>

        {/* Right: Projected output */}
        <div>
          <div className="card">
            <div className="card-header">
              <Calculator size={16} style={{ color: 'var(--color-accent)' }} />
              <span className="card-title" style={{ marginLeft: '6px' }}>Projected Outcome</span>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <ResultCard label="WhatsApp Projected" value={whatsappRegs} sub={`at ${whatsappConv}% CTR, 15% conv.`} />
                <ResultCard label="Ambassador Projected" value={ambRegs} sub={`${ambCount} amb × ${ambRegsEach} regs`} />
                <ResultCard label="LinkedIn Projected" value={linkedinRegs} sub={`${formatCurrency(linkedinBudget)} ÷ ₹${linkedinCPR}`} />
                <ResultCard label="Additional Cost" value={formatCurrency(totalCost)} sub="New spend" />
              </div>

              <hr className="divider" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <ResultCard label="Total Projected New Regs" value={totalProjected} accent />
                <ResultCard label="Combined Total" value={combinedRegs} sub={`Current ${currentRegs} + ${totalProjected} new`} accent />
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Projected vs Target</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: gapToClosed ? 'var(--color-success)' : 'var(--color-warning)' }}>
                    {Math.round(Math.min((combinedRegs / campaign.target) * 100, 100))}%
                  </span>
                </div>
                <div className="progress-bar-container" style={{ height: '10px' }}>
                  <div className="progress-bar-fill" style={{
                    width: `${Math.min((combinedRegs / campaign.target) * 100, 100)}%`,
                    background: gapToClosed ? 'var(--color-success)' : 'var(--color-accent)',
                  }} />
                </div>
                <div style={{ marginTop: '8px', fontSize: '13px', color: gapToClosed ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 600 }}>
                  {gapToClosed
                    ? `✓ This scenario closes the gap (${combinedRegs} ≥ ${campaign.target})`
                    : `Still short by ${campaign.target - combinedRegs} registrations`
                  }
                </div>
              </div>

              {projCPR > 0 && (
                <div style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '12px 14px',
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)',
                }}>
                  Projected CPR for paid channel: <strong style={{ color: 'var(--color-text-primary)' }}>{formatCurrency(Math.round(projCPR))}</strong>
                  {' '}per registration
                </div>
              )}

              <div style={{
                marginTop: '16px',
                padding: '10px 14px',
                background: '#FEF3C7',
                border: '1px solid #FDE68A',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#78350F',
              }}>
                <strong>Disclaimer:</strong> These projections are estimates based on assumed conversion rates. Actual results will vary based on audience quality, message relevance, and timing.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
