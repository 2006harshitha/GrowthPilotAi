// src/modules/channels/ChannelForm.jsx
import { useState } from 'react';
import Modal from '../../components/ui/Modal.jsx';

const COLORS = ['#6366F1','#10B981','#F59E0B','#EF4444','#3B82F6','#8B5CF6','#EC4899'];

export default function ChannelForm({ isOpen, onClose, channel, onSave }) {
  const editing = !!channel;
  const [form, setForm] = useState({
    name:          channel?.name          || '',
    type:          channel?.type          || 'community',
    reach:         channel?.reach         ?? 0,
    clicks:        channel?.clicks        ?? 0,
    spend:         channel?.spend         ?? 0,
    color:         channel?.color         || '#6366F1',
  });
  const [error, setError] = useState('');

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  }

  function handleSave() {
    if (!form.name.trim()) { setError('Channel name is required.'); return; }
    if (form.reach < 0 || form.clicks < 0 || form.spend < 0) {
      setError('Numeric values cannot be negative.'); return;
    }
    onSave({
      ...channel,
      id:           channel?.id || `ch-${Date.now()}`,
      name:         form.name.trim(),
      type:         form.type,
      reach:        Number(form.reach),
      clicks:       Number(form.clicks),
      registrations: channel?.registrations || 0,
      spend:        Number(form.spend),
      color:        form.color,
    });
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editing ? 'Edit Channel' : 'Add Channel'}
      confirmLabel={editing ? 'Save Changes' : 'Add Channel'}
      onConfirm={handleSave}
    >
      <div className="form-group">
        <label>Channel Name *</label>
        <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Facebook Groups" />
      </div>
      <div className="form-group">
        <label>Type</label>
        <select value={form.type} onChange={e => handleChange('type', e.target.value)}>
          <option value="community">Community (free)</option>
          <option value="ambassador">Ambassador</option>
          <option value="paid">Paid</option>
          <option value="organic">Organic</option>
        </select>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Estimated Reach</label>
          <input type="number" min="0" value={form.reach} onChange={e => handleChange('reach', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Link Clicks</label>
          <input type="number" min="0" value={form.clicks} onChange={e => handleChange('clicks', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Spend (₹)</label>
        <input type="number" min="0" value={form.spend} onChange={e => handleChange('spend', e.target.value)} />
      </div>
      <div className="form-group">
        <label>Color</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => handleChange('color', c)}
              style={{
                width: '28px', height: '28px',
                borderRadius: '50%',
                background: c,
                border: form.color === c ? '3px solid var(--color-text-primary)' : '3px solid transparent',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>
      {error && <p style={{ color: 'var(--color-error)', fontSize: '13px' }}>{error}</p>}
    </Modal>
  );
}
