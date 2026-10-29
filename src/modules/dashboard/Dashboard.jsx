// src/modules/dashboard/Dashboard.jsx
import { useState } from 'react';
import {
  Target, Users, TrendingUp, BarChart2,
  DollarSign, Wallet, Zap, Award, Clock, ArrowRight,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore.jsx';
import KPICard from '../../components/ui/KPICard.jsx';
import RegistrationTrendChart from '../../components/charts/RegistrationTrendChart.jsx';
import ChannelBreakdownChart from '../../components/charts/ChannelBreakdownChart.jsx';
import FunnelChart from '../../components/charts/FunnelChart.jsx';
import Badge from '../../components/ui/Badge.jsx';
import {
  getTotalSpent, getBudgetRemaining, getRegistrationCompletion,
  getRemainingRegistrations, getCPR, getBestChannel,
  getDailyData, formatCurrency, formatPercent, formatDate, safeDivide,
} from '../../data/calculations.js';
import { generateRecommendations } from '../../data/recommendations.js';

export default function Dashboard() {
  const { state } = useAppStore();
  const { campaign, channels, registrations, transactions, dailyPlan } = state;

  const totalRegs      = registrations.length;
  const totalSpent     = getTotalSpent(transactions);
  const budgetLeft     = getBudgetRemaining(campaign.budget, transactions);
  const completion     = getRegistrationCompletion(registrations, campaign.target);
  const remaining      = getRemainingRegistrations(registrations, campaign.target);
  const cpr            = getCPR(totalSpent, totalRegs);
  const totalClicks    = channels.reduce((s, c) => s + c.clicks, 0);
  const convRate       = safeDivide(totalRegs, totalClicks) * 100;
  const bestChannel    = getBestChannel(channels, registrations, 'registrations');
  const dailyData      = getDailyData(registrations, dailyPlan);
  const recommendations = generateRecommendations(state);
  const topRec          = recommendations[0];

  const recentRegs = [...registrations]
    .sort((a, b) => b.registrationDate.localeCompare(a.registrationDate))
    .slice(0, 5);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="section-title">{campaign.name}</h2>
        <p className="section-subtitle">Campaign window: Jan 15 – Jan 21, 2024 · 7-day sprint</p>
      </div>

      {/* KPI Row 1: Registrations */}
      <div className="kpi-grid">
        <KPICard
          icon={<Target size={18} />}
          label="Target"
          value="500"
          subtitle="Registrations goal"
          accentColor="var(--color-accent)"
        />
        <KPICard
          icon={<Users size={18} />}
          label="Total Registrations"
          value={totalRegs.toLocaleString()}
          subtitle="Unique registrants (simulated)"
          accentColor="#10B981"
        />
        <KPICard
          icon={<TrendingUp size={18} />}
          label="Target Completion"
          value={formatPercent(completion)}
          subtitle={`${remaining} remaining`}
          accentColor="#6366F1"
          trend={{ value: completion - 50, label: completion >= 50 ? 'On track' : 'Below pace' }}
        />
        <KPICard
          icon={<BarChart2 size={18} />}
          label="Conversion Rate"
          value={formatPercent(convRate)}
          subtitle="Clicks to registrations"
          accentColor="#F59E0B"
        />
      </div>

      {/* KPI Row 2: Budget */}
      <div className="kpi-grid">
        <KPICard
          icon={<Wallet size={18} />}
          label="Campaign Budget"
          value={formatCurrency(campaign.budget)}
          subtitle="Total allocated"
          accentColor="#64748B"
        />
        <KPICard
          icon={<DollarSign size={18} />}
          label="Amount Spent"
          value={formatCurrency(totalSpent)}
          subtitle={formatPercent(safeDivide(totalSpent, campaign.budget) * 100) + ' of budget'}
          accentColor="#EF4444"
        />
        <KPICard
          icon={<Zap size={18} />}
          label="Budget Remaining"
          value={formatCurrency(budgetLeft)}
          subtitle={budgetLeft <= 200 ? 'Nearly depleted' : 'Available'}
          accentColor={budgetLeft <= 200 ? '#EF4444' : '#10B981'}
        />
        <KPICard
          icon={<BarChart2 size={18} />}
          label="Cost Per Registration"
          value={totalRegs > 0 ? formatCurrency(Math.round(cpr)) : '—'}
          subtitle="Avg across paid channels"
          accentColor="#6366F1"
        />
      </div>

      {/* Charts Row */}
      <div className="two-col mb-6">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Daily Registration Trend</span>
            <Badge variant="neutral">Planned vs Actual</Badge>
          </div>
          <div className="card-body">
            <RegistrationTrendChart data={dailyData} />
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Registrations by Channel</span>
          </div>
          <div className="card-body">
            <ChannelBreakdownChart channels={channels} registrations={registrations} />
          </div>
        </div>
      </div>

      {/* Funnel */}
      <div className="card mb-6">
        <div className="card-header">
          <span className="card-title">Campaign Funnel — Reach → Clicks → Registrations</span>
          <Badge variant="info">Per Channel</Badge>
        </div>
        <div className="card-body">
          <FunnelChart channels={channels} registrations={registrations} />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card mb-6">
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700 }}>
              Progress to 500 Registrations
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-accent)' }}>
              {totalRegs} / 500
            </span>
          </div>
          <div className="progress-bar-container" style={{ height: '12px' }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min(completion, 100)}%` }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              {formatPercent(completion)} complete
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              {remaining} to go
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="two-col mb-6">
        {/* Best Channel */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Best Channel</span>
            <Badge variant="success">By Registrations</Badge>
          </div>
          <div className="card-body">
            {bestChannel ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: bestChannel.color || 'var(--color-accent)', flexShrink: 0,
                  }} />
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{bestChannel.name}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    ['Registrations', registrations.filter(r => r.channelId === bestChannel.id).length],
                    ['Reach', bestChannel.reach.toLocaleString()],
                    ['Clicks', bestChannel.clicks.toLocaleString()],
                    ['Spend', formatCurrency(bestChannel.spend)],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                      <div style={{ fontWeight: 700, fontSize: '15px' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>No channels yet.</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Registrations</span>
            <Badge variant="neutral">Last 5</Badge>
          </div>
          <div style={{ overflowX: 'auto' }}>
            {recentRegs.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Channel</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRegs.map(r => {
                    const ch = channels.find(c => c.id === r.channelId);
                    return (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 500 }}>{r.name}</td>
                        <td>
                          <span style={{
                            fontSize: '11px',
                            background: 'var(--color-accent-light)',
                            color: 'var(--color-accent)',
                            padding: '2px 7px',
                            borderRadius: '9999px',
                            fontWeight: 600,
                          }}>
                            {ch ? ch.name.split(' ')[0] : r.channelId}
                          </span>
                        </td>
                        <td style={{ color: 'var(--color-text-secondary)' }}>{formatDate(r.registrationDate)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 13 }}>
                No registrations yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Action Card */}
      {topRec && (
        <div className="card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                width: '36px', height: '36px',
                background: 'var(--color-accent-light)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-accent)', flexShrink: 0,
              }}>
                <Award size={18} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  Next Recommended Action
                </div>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{topRec.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>{topRec.description}</div>
                <div style={{ fontSize: '13px', color: 'var(--color-accent)', fontWeight: 600 }}>
                  → {topRec.action}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
