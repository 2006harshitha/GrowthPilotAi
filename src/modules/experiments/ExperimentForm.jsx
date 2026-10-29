// src/modules/experiments/ExperimentForm.jsx
import { useState } from 'react';
import Modal from '../../components/ui/Modal.jsx';

export default function ExperimentForm({ isOpen, onClose, experiment, onSave }) {
  const editing = !!experiment;
  const varA = experiment?.variants?.[0];
  const varB = experiment?.variants?.[1];

  const [form, setForm] = useState({
    name:     experiment?.name     || '',
    status:   experiment?.status   || 'running',
    // Variant A
    msgA:     varA?.message        || 'Build Your First AI Project in 60 Minutes — Join Free.',
    reachA:   varA?.reach          ?? 4200,
    clicksA:  varA?.clicks         ?? 0,
    regsA:    varA?.registrations  ?? 0,
    // Variant B
    msgB:     varB?.message        || 'Prepare for Placements with a Practical AI Project — Register Free.',
    reachB:   varB?.reach          ?? 4200,
    clicksB:  varB?.clicks         ?? 0,
    regsB:    varB?.registrations  ?? 0,
  });
  const [error, setError] = useState('');

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  }

  function handleSave() {
    if (!form.name.trim()) { setError('Experiment name is required.'); return; }
    if (!form.msgA.trim() || !form.msgB.trim()) { setError('Both variant messages are required.'); return; }

    const id = experiment?.id || `exp-${Date.now()}`;
    onSave({
      id,
      name:        form.name.trim(),
      status:      form.status,
      startDate:   experiment?.startDate || new Date().toISOString().slice(0, 10),
      isSimulated: true,
      disclaimer:  'Results are directional only. Statistical significance not established.',
      variants: [
        {
          id:            varA?.id || 'var-a',
          label:         'Variant A',
          message:       form.msgA.trim(),
          reach:         Number(form.reachA),
          clicks:        Number(form.clicksA),
          registrations: Number(form.regsA),
          isSimulated:   true,
        },
        {
          id:            varB?.id || 'var-b',
          label:         'Variant B',
          message:       form.msgB.trim(),
          reach:         Number(form.reachB),
          clicks:        Number(form.clicksB),
          registrations: Number(form.regsB),
          isSimulated:   true,
        },
      ],
    });
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editing ? 'Edit Experiment' : 'New Experiment'}
      confirmLabel={editing ? 'Save Changes' : 'Create Experiment'}
      onConfirm={handleSave}
      width="560px"
    >
      <div className="form-row">
        <div className="form-group">
          <label>Experiment Name *</label>
          <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Workshop Message Test" />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={form.status} onChange={e => handleChange('status', e.target.value)}>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      <hr className="divider" />
      <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: 'var(--color-accent)' }}>Variant A</h4>
      <div className="form-group">
        <label>Message Copy *</label>
        <textarea rows={2} value={form.msgA} onChange={e => handleChange('msgA', e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div className="form-group">
          <label>Reach</label>
          <input type="number" min="0" value={form.reachA} onChange={e => handleChange('reachA', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Clicks</label>
          <input type="number" min="0" value={form.clicksA} onChange={e => handleChange('clicksA', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Registrations</label>
          <input type="number" min="0" value={form.regsA} onChange={e => handleChange('regsA', e.target.value)} />
        </div>
      </div>

      <hr className="divider" />
      <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: 'var(--color-success)' }}>Variant B</h4>
      <div className="form-group">
        <label>Message Copy *</label>
        <textarea rows={2} value={form.msgB} onChange={e => handleChange('msgB', e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div className="form-group">
          <label>Reach</label>
          <input type="number" min="0" value={form.reachB} onChange={e => handleChange('reachB', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Clicks</label>
          <input type="number" min="0" value={form.clicksB} onChange={e => handleChange('clicksB', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Registrations</label>
          <input type="number" min="0" value={form.regsB} onChange={e => handleChange('regsB', e.target.value)} />
        </div>
      </div>

      {error && <p style={{ color: 'var(--color-error)', fontSize: '13px', marginTop: '8px' }}>{error}</p>}
    </Modal>
  );
}
