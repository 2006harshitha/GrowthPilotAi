// src/modules/ambassadors/AmbassadorForm.jsx
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import Modal from '../../components/ui/Modal.jsx';

function generateCode(name) {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);
  return `${clean}${new Date().getFullYear()}`;
}

export default function AmbassadorForm({ isOpen, onClose, ambassador, channels, onSave }) {
  const editing = !!ambassador;
  const [form, setForm] = useState({
    name:      ambassador?.name      || '',
    college:   ambassador?.college   || '',
    code:      ambassador?.code      || '',
    channelId: ambassador?.channelId || (channels[0]?.id || ''),
    status:    ambassador?.status    || 'active',
    joinDate:  ambassador?.joinDate  || new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState('');

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  }

  function autoCode() {
    if (form.name.trim()) {
      handleChange('code', generateCode(form.name));
    }
  }

  function handleSave() {
    if (!form.name.trim())    { setError('Name is required.'); return; }
    if (!form.college.trim()) { setError('College is required.'); return; }
    if (!form.code.trim())    { setError('Referral code is required.'); return; }
    onSave({
      ...ambassador,
      id:           ambassador?.id || `amb-${Date.now()}`,
      name:         form.name.trim(),
      college:      form.college.trim(),
      code:         form.code.trim().toUpperCase(),
      channelId:    form.channelId,
      status:       form.status,
      joinDate:     form.joinDate,
      registrations: ambassador?.registrations || 0,
    });
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editing ? 'Edit Ambassador' : 'Add Ambassador'}
      confirmLabel={editing ? 'Save Changes' : 'Add Ambassador'}
      onConfirm={handleSave}
    >
      <div className="form-row">
        <div className="form-group">
          <label>Full Name *</label>
          <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Arjun Sharma" />
        </div>
        <div className="form-group">
          <label>College / Community *</label>
          <input type="text" value={form.college} onChange={e => handleChange('college', e.target.value)} placeholder="e.g. IIT Hyderabad" />
        </div>
      </div>
      <div className="form-group">
        <label>Referral Code *</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={form.code}
            onChange={e => handleChange('code', e.target.value.toUpperCase())}
            placeholder="e.g. ARJUN2024"
            style={{ flex: 1 }}
          />
          <button type="button" className="btn btn-sm" onClick={autoCode} title="Auto-generate from name">
            <RefreshCw size={13} /> Generate
          </button>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Channel</label>
          <select value={form.channelId} onChange={e => handleChange('channelId', e.target.value)}>
            {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={form.status} onChange={e => handleChange('status', e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Join Date</label>
        <input type="date" value={form.joinDate} onChange={e => handleChange('joinDate', e.target.value)} />
      </div>
      {error && <p style={{ color: 'var(--color-error)', fontSize: '13px' }}>{error}</p>}
    </Modal>
  );
}
