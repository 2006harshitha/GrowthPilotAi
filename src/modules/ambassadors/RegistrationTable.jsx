// src/modules/ambassadors/RegistrationTable.jsx
import { useState } from 'react';
import { Search, Download, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore, useToastCtx } from '../../store/useAppStore.jsx';
import { exportRegistrationsCSV } from '../../data/csvExport.js';
import Badge from '../../components/ui/Badge.jsx';
import Modal from '../../components/ui/Modal.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { formatDate } from '../../data/calculations.js';

const PAGE_SIZE = 20;

export default function RegistrationTable() {
  const { state, dispatch } = useAppStore();
  const { addToast }        = useToastCtx();
  const { registrations, channels } = state;
  const [search, setSearch]     = useState('');
  const [channelFilter, setCF]  = useState('all');
  const [page, setPage]         = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const channelMap = Object.fromEntries(channels.map(c => [c.id, c]));

  const filtered = registrations.filter(r => {
    const matchSearch = !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      (r.college || '').toLowerCase().includes(search.toLowerCase());
    const matchChannel = channelFilter === 'all' || r.channelId === channelFilter;
    return matchSearch && matchChannel;
  });

  const sorted = [...filtered].sort((a, b) => b.registrationDate.localeCompare(a.registrationDate));
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleDelete() {
    dispatch({ type: 'REMOVE_REGISTRATION', payload: deleteId });
    addToast('Registration removed.', 'info');
    setDeleteId(null);
  }

  function handleExport() {
    exportRegistrationsCSV(filtered, channels);
    addToast(`Exported ${filtered.length} registrations.`, 'success');
  }

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
          <input
            type="text"
            placeholder="Search name, email, college…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ paddingLeft: '32px' }}
          />
        </div>
        <select
          value={channelFilter}
          onChange={e => { setCF(e.target.value); setPage(1); }}
          style={{ width: 'auto', minWidth: '180px' }}
        >
          <option value="all">All Channels</option>
          {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn btn-sm" onClick={handleExport}>
          <Download size={14} /> Export CSV
        </button>
        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
          {filtered.length} records
        </span>
      </div>

      {/* Table */}
      {paginated.length === 0 ? (
        <EmptyState title="No registrations found" description="Try adjusting your search or filters." />
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>College</th>
                  <th>Channel</th>
                  <th>Referral Code</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(r => {
                  const ch = channelMap[r.channelId];
                  return (
                    <tr key={r.id}>
                      <td style={{ color: 'var(--color-text-secondary)', fontSize: '12px', fontFamily: 'monospace' }}>{r.id}</td>
                      <td style={{ fontWeight: 500 }}>{r.name}</td>
                      <td style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{r.email}</td>
                      <td style={{ fontSize: '12px' }}>{r.college || '—'}</td>
                      <td>
                        {ch && (
                          <span style={{
                            fontSize: '11px',
                            background: ch.color + '22',
                            color: ch.color,
                            padding: '2px 7px',
                            borderRadius: '9999px',
                            fontWeight: 600,
                          }}>
                            {ch.name.split(' ')[0]}
                          </span>
                        )}
                      </td>
                      <td>
                        {r.ambassadorCode ? (
                          <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-accent)' }}>
                            {r.ambassadorCode}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>—</span>
                        )}
                      </td>
                      <td style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>{formatDate(r.registrationDate)}</td>
                      <td><Badge variant={r.isSimulated ? 'neutral' : 'success'}>{r.isSimulated ? 'Simulated' : 'Live'}</Badge></td>
                      <td>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setDeleteId(r.id)}
                          style={{ color: 'var(--color-error)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Page {page} of {totalPages}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button className="btn btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft size={14} />
                </button>
                <button className="btn btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Remove Registration?"
        confirmLabel="Remove"
        onConfirm={handleDelete}
        danger
      >
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
          This will permanently remove this registration record. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
