// src/data/calculations.js
// Pure functions only — no imports from the store. All divisions use safeDivide.

export function safeDivide(numerator, denominator, fallback = 0) {
  if (!denominator || denominator === 0) return fallback;
  return numerator / denominator;
}

export function getTotalRegistrations(registrations) {
  return registrations.length;
}

export function getTotalSpent(transactions) {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

export function getBudgetRemaining(budget, transactions) {
  return budget - getTotalSpent(transactions);
}

export function getRegistrationCompletion(registrations, target) {
  return safeDivide(registrations.length, target) * 100;
}

export function getRemainingRegistrations(registrations, target) {
  return Math.max(0, target - registrations.length);
}

export function getCTR(clicks, reach) {
  return safeDivide(clicks, reach) * 100;
}

export function getConversionRate(registrations, clicks) {
  return safeDivide(registrations, clicks) * 100;
}

export function getCPR(spend, registrations) {
  return safeDivide(spend, registrations);
}

export function getBestChannel(channels, registrations, metric = 'registrations') {
  if (!channels || channels.length === 0) return null;
  const withMetrics = channels.map(ch => {
    const regs = registrations.filter(r => r.channelId === ch.id).length;
    const cpr  = getCPR(ch.spend, regs);
    const ctr  = getCTR(ch.clicks, ch.reach);
    const conv = getConversionRate(regs, ch.clicks);
    return { ...ch, regs, cpr, ctr, conv };
  });
  if (metric === 'cpr') {
    const withSpend = withMetrics.filter(c => c.spend > 0);
    if (!withSpend.length) return withMetrics[0];
    return withSpend.reduce((best, c) => (c.cpr < best.cpr ? c : best));
  }
  if (metric === 'conversion') return withMetrics.reduce((best, c) => (c.conv > best.conv ? c : best));
  if (metric === 'ctr')        return withMetrics.reduce((best, c) => (c.ctr  > best.ctr  ? c : best));
  return withMetrics.reduce((best, c) => (c.regs > best.regs ? c : best));
}

export function getDailyData(registrations, dayPlans) {
  return dayPlans.map(dp => ({
    date:      dp.date,
    day:       dp.day,
    target:    dp.target,
    actual:    dp.actual,
    planned:   dp.target,
    liveCount: registrations.filter(r => r.registrationDate === dp.date).length,
  }));
}

/**
 * getChannelStats — always derives spend from transactions so it never
 * diverges from channels[].spend when new transactions are added.
 * transactions is optional (falls back to channel.spend for legacy calls).
 */
export function getChannelStats(channel, registrations, transactions) {
  const regs  = registrations.filter(r => r.channelId === channel.id).length;
  const total = registrations.length;
  // If transactions are supplied, compute spend from them (single source of truth)
  const spend = transactions
    ? transactions.filter(t => t.channelId === channel.id).reduce((s, t) => s + t.amount, 0)
    : channel.spend;
  return {
    ...channel,
    spend,
    registrations:  regs,
    ctr:            getCTR(channel.clicks, channel.reach),
    conversionRate: getConversionRate(regs, channel.clicks),
    cpr:            getCPR(spend, regs),
    share:          safeDivide(regs, total) * 100,
  };
}

/**
 * getChannelSpend — derive a single channel's spend from transactions array.
 */
export function getChannelSpend(channelId, transactions) {
  return transactions
    .filter(t => t.channelId === channelId)
    .reduce((s, t) => s + t.amount, 0);
}

export function getDailyPaceNeeded(registrations, target, daysRemaining) {
  const remaining = getRemainingRegistrations(registrations, target);
  return Math.ceil(safeDivide(remaining, daysRemaining, remaining));
}

export function formatCurrency(amount) {
  if (amount === 0) return '₹0';
  return '₹' + amount.toLocaleString('en-IN');
}

export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) return '0.0%';
  return value.toFixed(decimals) + '%';
}

export function formatDate(dateStr, format = 'short') {
  const date = new Date(dateStr + 'T00:00:00');
  if (format === 'short') {
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  }
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
