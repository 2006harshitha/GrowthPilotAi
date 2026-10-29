// src/components/charts/ExperimentComparisonChart.jsx
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, Cell,
} from 'recharts';
import { getConversionRate, getCTR, safeDivide } from '../../data/calculations.js';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--color-border)',
      borderRadius: '6px',
      padding: '10px 14px',
      fontSize: '13px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      <div style={{ fontWeight: 600, marginBottom: '6px' }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.fill }}>
          {p.name}: <strong>{p.value.toFixed(2)}%</strong>
        </div>
      ))}
    </div>
  );
};

export default function ExperimentComparisonChart({ variants }) {
  if (!variants || variants.length < 2) return null;
  const [a, b] = variants;

  const data = [
    {
      metric: 'CTR',
      [a.label]: getCTR(a.clicks, a.reach),
      [b.label]: getCTR(b.clicks, b.reach),
    },
    {
      metric: 'Conv. Rate',
      [a.label]: getConversionRate(a.registrations, a.clicks),
      [b.label]: getConversionRate(b.registrations, b.clicks),
    },
    {
      metric: 'Reg. Rate',
      [a.label]: safeDivide(a.registrations, a.reach) * 100,
      [b.label]: safeDivide(b.registrations, b.reach) * 100,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="metric"
          tick={{ fontSize: 12, fill: '#94A3B8' }}
          axisLine={{ stroke: '#E2E8F0' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `${v.toFixed(1)}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
        <Bar dataKey={a.label} fill="#6366F1" radius={[3,3,0,0]} maxBarSize={50} />
        <Bar dataKey={b.label} fill="#10B981" radius={[3,3,0,0]} maxBarSize={50} />
      </BarChart>
    </ResponsiveContainer>
  );
}
