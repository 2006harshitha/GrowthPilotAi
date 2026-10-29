// src/components/layout/Sidebar.jsx
import { useState } from 'react';
import {
  LayoutDashboard, BarChart3, Users, FlaskConical,
  Brain, Calendar, Sliders, ChevronLeft, ChevronRight,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard',   icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { id: 'channels',    icon: <BarChart3 size={18} />,       label: 'Channel Analytics' },
  { id: 'ambassadors', icon: <Users size={18} />,           label: 'Ambassador Program' },
  { id: 'experiments', icon: <FlaskConical size={18} />,    label: 'Experiment Lab' },
  { id: 'advisor',     icon: <Brain size={18} />,           label: 'AI Advisor' },
  { id: 'planner',     icon: <Calendar size={18} />,        label: 'Campaign Planner' },
  { id: 'simulator',   icon: <Sliders size={18} />,         label: 'Scenario Simulator' },
];

export default function Sidebar({ currentPage, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);
  const width = collapsed ? '64px' : '240px';

  return (
    <aside style={{
      width,
      minWidth: width,
      background: 'var(--color-sidebar)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      transition: 'width 0.2s ease',
      overflow: 'hidden',
      zIndex: 100,
      flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minHeight: '64px',
      }}>
        <div style={{
          width: '32px', height: '32px',
          background: 'var(--color-accent)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: '14px',
          flexShrink: 0,
        }}>
          GP
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap' }}>
              GrowthPilot AI
            </div>
            <span style={{
              display: 'inline-block',
              background: '#F59E0B',
              color: '#78350F',
              fontSize: '9px',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '9999px',
              letterSpacing: '0.08em',
              marginTop: '2px',
            }}>
              DEMO
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 10px',
                borderRadius: '6px',
                border: 'none',
                background: active ? 'rgba(99,102,241,0.18)' : 'transparent',
                color: active ? '#fff' : 'var(--color-sidebar-text)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: active ? 600 : 400,
                marginBottom: '2px',
                transition: 'background 0.15s, color 0.15s',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--color-sidebar-text)';
                }
              }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div style={{
        padding: '12px 8px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '8px',
            padding: '8px 10px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: 'var(--color-sidebar-text)',
            cursor: 'pointer',
            fontSize: '12px',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
