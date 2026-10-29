// src/modules/ambassadors/ReferralForm.jsx
import { useState } from 'react';
import Modal from '../../components/ui/Modal.jsx';

export default function ReferralForm({ isOpen, onClose, ambassadors, channels, onRegister }) {
  const [form, setForm] = useState({
    name:          '',
    email:         '',
    college:       '',
    ambassadorCode: '',
    channelId:     channels[0]?.id || '',
  });
  const [error, setError] = useState('');

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function handleSubmit() {
    if (!form.name.trim())  { setError('Name is required.'); return; }
    if (!form.email.trim()) { setError('Email is required.'); return; }
    if (!validateEmail(form.email)) { setError('Please enter a valid email address.'); return; }

    // Resolve ambassador code to channel
    let resolvedChannelId = form.channelId;
    const matched = ambassadors.find(a => a.code === form.ambassadorCode.trim().toUpperCase());
    if (form.ambassadorCode.trim() && !matched) {
      setError(`Referral code "${form.ambassadorCode.trim().toUpperCase()}" does not match any ambassador.`);
      return;
    }
    if (matched) resolvedChannelId = matched.channelId;

    const result = onRegister({
      name:          form.name.trim(),
      email:         form.email.trim(),
      college:       form.college.trim(),
      channelId:     resolvedChannelId,
      ambassadorCode: matched?.code || null,
      registrationDate: new Date().toISOString().slice(0, 10),
      isSimulated:   false,
    });

    if (result?.error) {
      setError(result.error);
      return;
    }

    // Reset
    setForm({ name: '', email: '', college: '', ambassadorCode: '', channelId: channels[0]?.id || '' });
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register a Demo Referral"
      confirmLabel="Register"
      onConfirm={handleSubmit}
    >
      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
        Add a demonstration registration. Use synthetic data only — do not enter real personal information.
      </p>
      <div className="form-row">
        <div className="form-group">
          <label>Name *</label>
          <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Ravi Kumar" />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="ravi.kumar@demo.edu" />
        </div>
      </div>
      <div className="form-group">
        <label>College</label>
        <input type="text" value={form.college} onChange={e => handleChange('college', e.target.value)} placeholder="e.g. NIT Warangal" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Channel</label>
          <select value={form.channelId} onChange={e => handleChange('channelId', e.target.value)}>
            {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Referral Code (optional)</label>
          <input
            type="text"
            value={form.ambassadorCode}
            onChange={e => handleChange('ambassadorCode', e.target.value.toUpperCase())}
            placeholder="e.g. ARJUN2024"
          />
        </div>
      </div>
      {error && <p style={{ color: 'var(--color-error)', fontSize: '13px', marginTop: '8px' }}>{error}</p>}
    </Modal>
  );
}
