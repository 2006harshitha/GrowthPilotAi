// src/data/csvExport.js

function escapeCSV(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowToCSV(fields) {
  return fields.map(escapeCSV).join(',');
}

function downloadCSV(csv, filename) {
  const BOM  = '\uFEFF';
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportRegistrationsCSV(registrations, channels) {
  const channelMap = Object.fromEntries((channels || []).map(c => [c.id, c.name]));
  const header = ['ID', 'Name', 'Email', 'College', 'Channel', 'Referral Code', 'Date', 'Simulated'];
  const rows   = registrations.map(r => [
    r.id,
    r.name,
    r.email,
    r.college || '',
    channelMap[r.channelId] || r.channelId,
    r.ambassadorCode || '',
    r.registrationDate,
    r.isSimulated ? 'Yes' : 'No',
  ]);
  const csv = [header, ...rows].map(rowToCSV).join('\n');
  downloadCSV(csv, 'growthpilot-registrations.csv');
}

export function exportChannelsCSV(channels, registrations) {
  const header = ['ID', 'Channel', 'Reach', 'Clicks', 'Registrations', 'Spend (INR)', 'CTR %', 'Conv %', 'CPR'];
  const rows   = channels.map(ch => {
    const regs = registrations.filter(r => r.channelId === ch.id).length;
    const ctr  = ch.reach  ? ((ch.clicks / ch.reach)  * 100).toFixed(2) : '0.00';
    const conv = ch.clicks ? ((regs     / ch.clicks)  * 100).toFixed(2) : '0.00';
    const cpr  = regs      ? (ch.spend  / regs).toFixed(2)               : '0.00';
    return [ch.id, ch.name, ch.reach, ch.clicks, regs, ch.spend, ctr, conv, cpr];
  });
  const csv = [header, ...rows].map(rowToCSV).join('\n');
  downloadCSV(csv, 'growthpilot-channels.csv');
}
