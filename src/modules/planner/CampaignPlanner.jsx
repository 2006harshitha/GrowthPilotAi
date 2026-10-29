// src/modules/planner/CampaignPlanner.jsx
import { useAppStore, useToastCtx } from '../../store/useAppStore.jsx';
import DayPlanRow from './DayPlanRow.jsx';
import RegistrationTrendChart from '../../components/charts/RegistrationTrendChart.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { getDailyData, formatCurrency } from '../../data/calculations.js';

export default function CampaignPlanner() {
  const { state, dispatch } = useAppStore();
  const { addToast }        = useToastCtx();
  const { dailyPlan, channels, registrations, campaign } = state;

  function handleUpdate(day, data) {
    dispatch({ type: 'UPDATE_DAY_PLAN', payload: { day, data } });
    addToast(`Day ${day} plan updated.`, 'success');
  }

  const totalTarget  = dailyPlan.reduce((s, d) => s + d.target, 0);
  const totalActual  = dailyPlan.reduce((s, d) => s + d.actual, 0);
  const completedDays = dailyPlan.filter(d => d.status === 'completed').length;
  const dailyData    = getDailyData(registrations, dailyPlan);
  const onPace       = totalActual >= (totalTarget * (completedDays / dailyPlan.length));

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="section-title">Campaign Planner</h2>
        <p className="section-subtitle">7-day sprint timeline with planned vs actual registrations. Click the edit icon to update any day.</p>
      </div>

      {/* Summary KPIs */}
      <div className="kpi-grid mb-6">
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Target</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{totalTarget}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Total planned</div>
        </div>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Actual (to date)</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-success)' }}>{totalActual}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Simulated</div>
        </div>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Days Completed</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{completedDays} / {dailyPlan.length}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Of 7-day sprint</div>
        </div>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Pace Status</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: onPace ? 'var(--color-success)' : 'var(--color-warning)' }}>
            {onPace ? 'On Track' : 'Slightly Behind'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {totalActual} of {Math.round(totalTarget * completedDays / dailyPlan.length)} expected
          </div>
        </div>
      </div>

      {/* Trend chart */}
      <div className="card mb-6">
        <div className="card-header">
          <span className="card-title">Daily Planned vs Actual</span>
          <Badge variant="neutral">Simulated Data</Badge>
        </div>
        <div className="card-body">
          <RegistrationTrendChart data={dailyData} />
        </div>
      </div>

      {/* Day Plan Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">7-Day Plan</span>
          <Badge variant="info">Click edit icon to update</Badge>
        </div>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Date</th>
                <th>Activity</th>
                <th style={{ textAlign: 'right' }}>Target</th>
                <th>Actual</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Channel</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dailyPlan.map(plan => (
                <DayPlanRow
                  key={plan.day}
                  plan={plan}
                  channels={channels}
                  onUpdate={handleUpdate}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
