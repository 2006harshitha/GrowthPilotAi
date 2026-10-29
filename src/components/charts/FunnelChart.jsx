// src/components/charts/FunnelChart.jsx
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';

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
        <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', color: p.fill }}>
          <span>{p.name}</span>
          <strong>{p.value.toLocaleString()}</strong>
        </div>
      ))}
    </div>
  );
};

export default function FunnelChart({ channels, registrations }) {
  const data = channels.map(ch => ({
    name: ch.name.length > 20 ? ch.name.slice(0, 20) + '…' : ch.name,
    Reach: ch.reach,
    Clicks: ch.clicks,
    Registrations: registrations.filter(r => r.channelId === ch.id).length,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          axisLine={{ stroke: '#E2E8F0' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
        <Bar dataKey="Reach"         fill="#CBD5E1" radius={[3,3,0,0]} maxBarSize={40} />
        <Bar dataKey="Clicks"        fill="#818CF8" radius={[3,3,0,0]} maxBarSize={40} />
        <Bar dataKey="Registrations" fill="#6366F1" radius={[3,3,0,0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
