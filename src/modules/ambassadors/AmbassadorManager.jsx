// src/modules/ambassadors/AmbassadorManager.jsx
import { useState } from 'react';
import {
  Plus, Edit2, Trash2, Copy, UserPlus, Search,
  ArrowUpDown, Award,
} from 'lucide-react';
import { useAppStore, useToastCtx } from '../../store/useAppStore.jsx';
import AmbassadorForm from './AmbassadorForm.jsx';
import ReferralForm from './ReferralForm.jsx';
import RegistrationTable from './RegistrationTable.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Modal from '../../components/ui/Modal.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { formatDate } from '../../data/calculations.js';

export default function AmbassadorManager() {
  const { state, dispatch, safeDispatch } = useAppStore();
  const { addToast }                       = useToastCtx();
  const { ambassadors, channels, registrations } = state;

  const [tab,          setTab]    = useState('ambassadors');
  const [ambFormOpen,  setAmbFO]  = useState(false);
  const [refFormOpen,  setRefFO]  = useState(false);
  const [editing,      setEdit]   = useState(null);
  const [deleteId,     setDelId]  = useState(null);
  const [search,       setSearch] = useState('');
  const [sortField,    setSort]   = useState('registrations');
  const [statusFilter, setStatus] = useState('all');

  function handleSaveAmbassador(data) {
    if (editing) {
      dispatch({ type: 'UPDATE_AMBASSADOR', payload: data });
      addToast(`Ambassador "${data.name}" updated.`, 'success');
    } else {
      dispatch({ type: 'ADD_AMBASSADOR', payload: data });
      addToast(`Ambassador "${data.name}" added.`, 'success');
    }
  }

  function handleRegister(data) {
    const newReg = {
      ...data,
      id: `reg-${Date.now()}`,
    };
    let error = null;
    safeDispatch(
      { type: 'ADD_REGISTRATION', payload: newReg },
      (msg) => { error = msg; }
    );
    if (error) return { error };
    addToast(`Registration for "${data.name}" added.`, 'success');
    return {};
  }

  function handleDelete() {
    dispatch({ type: 'DELETE_AMBASSADOR', payload: deleteId });
    addToast('Ambassador removed.', 'info');
    setDelId(null);
  }

  function copyCode(code) {
    navigator.clipboard?.writeText(code).then(() => {
      addToast(`Referral code ${code} copied!`, 'success');
    }).catch(() => {
      addToast(`Code: ${code}`, 'info');
    });
  }

  // Count registrations per ambassador from registrations array
  const ambWithCounts = ambassadors.map(a => ({
    ...a,
    liveRegs: registrations.filter(r => r.ambassadorCode === a.code).length,
  }));

  const filtered = ambWithCounts
    .filter(a => {
      const matchSearch = !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.college.toLowerCase().includes(search.toLowerCase()) ||
        a.code.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortField === 'registrations') return b.liveRegs - a.liveRegs;
      if (sortField === 'name')          return a.name.localeCompare(b.name);
      if (sortField === 'joinDate')      return b.joinDate.localeCompare(a.joinDate);
      return 0;
    });

  const activeCount   = ambassadors.filter(a => a.status === 'active').length;
  const totalRegsCoded = registrations.filter(r => r.ambassadorCode).length;
  const topAmbassador = ambWithCounts.reduce((best, a) => (!best || a.liveRegs > best.liveRegs ? a : best), null);

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="section-title">Ambassador Program</h2>
          <p className="section-subtitle">Manage student ambassadors and track referral registrations.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn" onClick={() => { setRefFO(true); }}>
            <UserPlus size={14} /> Add Referral
          </button>
          <button className="btn btn-primary" onClick={() => { setEdit(null); setAmbFO(true); }}>
            <Plus size={14} /> Add Ambassador
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="kpi-grid mb-6">
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Total Ambassadors</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{ambassadors.length}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{activeCount} active</div>
        </div>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Referral Registrations</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>{totalRegsCoded}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Via referral codes</div>
        </div>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Top Ambassador</div>
          <div style={{ fontSize: '16px', fontWeight: 700 }}>{topAmbassador?.name || '—'}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{topAmbassador ? `${topAmbassador.liveRegs} registrations` : ''}</div>
        </div>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Avg per Ambassador</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>
            {activeCount > 0 ? (totalRegsCoded / activeCount).toFixed(1) : '0'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Registrations/ambassador</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '16px', borderBottom: '2px solid var(--color-border)' }}>
        {['ambassadors', 'registrations'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 20px',
              background: 'none',
              border: 'none',
              borderBottom: tab === t ? '2px solid var(--color-accent)' : '2px solid transparent',
              marginBottom: '-2px',
              color: tab === t ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              fontWeight: tab === t ? 700 : 400,
              fontSize: '13px',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {t === 'ambassadors' ? 'Ambassadors' : 'Registrations'}
          </button>
        ))}
      </div>

      {tab === 'ambassadors' && (
        <>
          {/* Filter row */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
              <input
                type="text"
                placeholder="Search ambassadors…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
            </div>
            <select value={statusFilter} onChange={e => setStatus(e.target.value)} style={{ width: 'auto' }}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select value={sortField} onChange={e => setSort(e.target.value)} style={{ width: 'auto' }}>
              <option value="registrations">Sort: Most Registrations</option>
              <option value="name">Sort: Name A–Z</option>
              <option value="joinDate">Sort: Newest First</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState title="No ambassadors found" description="Try adjusting your search or add a new ambassador." />
          ) : (
            <div className="card">
              <div className="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>College</th>
                      <th>Referral Code</th>
                      <th>Channel</th>
                      <th>Registrations</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a, idx) => {
                      const ch = channels.find(c => c.id === a.channelId);
                      const isTop = idx === 0 && a.liveRegs > 0;
                      return (
                        <tr key={a.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {isTop && <Award size={13} style={{ color: '#F59E0B' }} />}
                              <span style={{ fontWeight: 500 }}>{a.name}</span>
                            </div>
                          </td>
                          <td style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{a.college}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 600, color: 'var(--color-accent)' }}>
                                {a.code}
                              </span>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => copyCode(a.code)}
                                title="Copy code"
                                style={{ padding: '2px 4px' }}
                              >
                                <Copy size={12} />
                              </button>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                              {ch?.name.split(' ')[0] || '—'}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 700, color: a.liveRegs > 0 ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>
                              {a.liveRegs}
                            </span>
                          </td>
                          <td><Badge variant={a.status}>{a.status}</Badge></td>
                          <td style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{formatDate(a.joinDate)}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button className="btn btn-ghost btn-sm" onClick={() => { setEdit(a); setAmbFO(true); }}>
                                <Edit2 size={13} />
                              </button>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setDelId(a.id)}
                                style={{ color: 'var(--color-error)' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'registrations' && <RegistrationTable />}

      <AmbassadorForm
        key={editing?.id ?? 'new'}
        isOpen={ambFormOpen}
        onClose={() => setAmbFO(false)}
        ambassador={editing}
        channels={channels}
        onSave={handleSaveAmbassador}
      />

      <ReferralForm
        isOpen={refFormOpen}
        onClose={() => setRefFO(false)}
        ambassadors={ambassadors}
        channels={channels}
        onRegister={handleRegister}
      />

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDelId(null)}
        title="Remove Ambassador?"
        confirmLabel="Remove"
        onConfirm={handleDelete}
        danger
      >
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
          This will remove the ambassador record. Registrations attributed to their code will remain.
        </p>
      </Modal>
    </div>
  );
}
