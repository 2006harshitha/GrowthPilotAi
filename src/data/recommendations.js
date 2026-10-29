// src/data/recommendations.js
// Rule-based recommendation engine. No LLM required.

import { getCPR, getConversionRate, safeDivide } from './calculations.js';

export function generateRecommendations(state) {
  const { channels, registrations, transactions, experiments, dailyPlan, campaign } = state;
  const recs = [];

  const totalRegs  = registrations.length;
  const totalSpent = transactions.reduce((s, t) => s + t.amount, 0);
  const budget     = campaign.budget;
  const target     = campaign.target;

  // ── Per-channel metrics ──────────────────────────────────────────────────────
  const channelStats = channels.map(ch => {
    const regs = registrations.filter(r => r.channelId === ch.id).length;
    return {
      ...ch,
      regs,
      cpr:  getCPR(ch.spend, regs),
      conv: getConversionRate(regs, ch.clicks),
    };
  });
  const channelsWithSpend = channelStats.filter(c => c.spend > 0 && c.regs > 0);
  const avgCPR = channelsWithSpend.length
    ? channelsWithSpend.reduce((s, c) => s + c.cpr, 0) / channelsWithSpend.length
    : 0;

  // Rule 1: Best CPR channel is 20%+ better than average
  if (avgCPR > 0) {
    const best = channelsWithSpend.reduce((b, c) => (c.cpr < b.cpr ? c : b), channelsWithSpend[0]);
    if (best && best.cpr < avgCPR * 0.8) {
      recs.push({
        id: `rec-doubledown-${best.id}`,
        priority: 'high',
        title: `Double Down on ${best.name}`,
        description: `Cost per registration (₹${best.cpr.toFixed(0)}) is 20%+ below the channel average (₹${avgCPR.toFixed(0)}). Most cost-efficient paid channel.`,
        action: `Reallocate budget from underperforming channels to ${best.name}`,
        metric: 'CPR',
        value: `₹${best.cpr.toFixed(0)}`,
        confidence: 'High',
        icon: 'TrendingUp',
        channelId: best.id,
      });
    }
  }

  // Rule 2: High clicks but low conversion
  channelStats.forEach(ch => {
    if (ch.clicks > 200 && ch.conv < 10) {
      recs.push({
        id: `rec-dropoff-${ch.id}`,
        priority: 'high',
        title: `Fix Drop-off on ${ch.name}`,
        description: `${ch.clicks} clicks but only ${ch.conv.toFixed(1)}% click-to-registration rate. Message-to-registration funnel needs improvement.`,
        action: 'A/B test landing page copy or simplify the registration flow',
        metric: 'Conversion Rate',
        value: `${ch.conv.toFixed(1)}%`,
        confidence: 'High',
        icon: 'AlertCircle',
        channelId: ch.id,
      });
    }
  });

  // Rule 3: Campaign behind target
  const completedDays  = dailyPlan.filter(d => d.status === 'completed');
  const plannedSoFar   = completedDays.reduce((s, d) => s + d.target, 0);
  if (plannedSoFar > 0 && totalRegs < plannedSoFar * 0.6) {
    recs.push({
      id: 'rec-behind',
      priority: 'high',
      title: 'Campaign Behind Target',
      description: `${totalRegs} registrations against ${plannedSoFar} planned. Behind by ${plannedSoFar - totalRegs}.`,
      action: 'Prioritize top-performing channels immediately and increase outreach intensity',
      metric: 'Target Gap',
      value: `${plannedSoFar - totalRegs} behind`,
      confidence: 'High',
      icon: 'TrendingDown',
    });
  }

  // Rule 4: Budget nearly depleted
  const budgetUsedPct = safeDivide(totalSpent, budget) * 100;
  if (budgetUsedPct >= 90) {
    const remaining = budget - totalSpent;
    recs.push({
      id: 'rec-budget',
      priority: 'high',
      title: 'Budget Nearly Depleted',
      description: `${budgetUsedPct.toFixed(0)}% of ₹${budget} spent. Only ₹${remaining} remaining.`,
      action: 'Focus remaining effort on free channels (WhatsApp & Telegram communities)',
      metric: 'Budget Remaining',
      value: `₹${remaining}`,
      confidence: 'High',
      icon: 'AlertTriangle',
    });
  }

  // Rule 5: Experiment has fewer than 100 observations per variant
  if (experiments && experiments.length > 0) {
    const exp  = experiments[0];
    const varA = exp.variants.find(v => v.id === 'var-a');
    const varB = exp.variants.find(v => v.id === 'var-b');
    if (varA && varB) {
      if (varA.registrations < 100 || varB.registrations < 100) {
        recs.push({
          id: 'rec-ab-data',
          priority: 'medium',
          title: 'Collect More A/B Test Data',
          description: `Variant A: ${varA.registrations} observations, Variant B: ${varB.registrations}. Minimum ~100 per variant recommended for directional insights.`,
          action: 'Continue running both variants before drawing conclusions',
          metric: 'Sample Size',
          value: `${Math.min(varA.registrations, varB.registrations)} min`,
          confidence: 'Medium',
          icon: 'FlaskConical',
        });
      }
    }
  }

  // Rule 6: Variant B beats Variant A on conversion — consider adopting winner
  if (experiments && experiments.length > 0) {
    const exp = experiments[0];
    if (exp.variants && exp.variants.length === 2) {
      const varA = exp.variants[0];
      const varB = exp.variants[1];
      const convA = getConversionRate(varA.registrations, varA.clicks);
      const convB = getConversionRate(varB.registrations, varB.clicks);
      if (convB > convA * 1.1 && varA.registrations >= 30 && varB.registrations >= 30) {
        recs.push({
          id: 'rec-ab-winner',
          priority: 'medium',
          title: `Consider Adopting ${varB.label} Messaging`,
          description: `${varB.label} conversion rate (${convB.toFixed(1)}%) exceeds ${varA.label} (${convA.toFixed(1)}%) by ${(convB - convA).toFixed(1)}pp. Directional signal — not yet statistically significant. Note: simulated data only.`,
          action: `If real-world data confirms this trend, roll out ${varB.label} messaging across all channels`,
          metric: 'Conversion Lift',
          value: `+${(convB - convA).toFixed(1)}pp`,
          confidence: 'Medium',
          icon: 'Sparkles',
        });
      }
    }
  }

  // Rule 7: Ambassador channel has high volume but highest CPR among paid channels
  const ambChannel = channelStats.find(c => c.id === 'ch-002');
  if (ambChannel && channelsWithSpend.length > 1) {
    const worstCPR = Math.max(...channelsWithSpend.map(c => c.cpr));
    if (ambChannel.cpr === worstCPR && ambChannel.regs > 50) {
      recs.push({
        id: 'rec-ambassador-cpr',
        priority: 'medium',
        title: 'Review Ambassador Incentive Cost',
        description: `Ambassador channel drives ${ambChannel.regs} registrations but has the highest CPR (₹${ambChannel.cpr.toFixed(0)}) among paid channels. High volume but lower cost-efficiency than other paid channels.`,
        action: 'Review ambassador incentive structure or negotiate lower per-referral costs to improve CPR',
        metric: 'CPR',
        value: `₹${ambChannel.cpr.toFixed(0)}`,
        confidence: 'Medium',
        icon: 'Users',
        channelId: ambChannel.id,
      });
    }
  }

  // Rule 8: High-reach channel with <1% registration rate
  channelStats.forEach(ch => {
    const regRate = safeDivide(ch.regs, ch.reach) * 100;
    if (ch.reach > 10000 && regRate < 1) {
      recs.push({
        id: `rec-reach-${ch.id}`,
        priority: 'medium',
        title: `Low Conversion on High-Reach Channel`,
        description: `${ch.name} reaches ${ch.reach.toLocaleString()} but only ${regRate.toFixed(2)}% register. Targeting may be too broad.`,
        action: 'Narrow audience targeting or improve message relevance for this channel',
        metric: 'Registration Rate',
        value: `${regRate.toFixed(2)}%`,
        confidence: 'Medium',
        icon: 'Target',
        channelId: ch.id,
      });
    }
  });

  // Rule 9: Daily pace required
  const upcomingDays = dailyPlan.filter(d => d.status === 'upcoming').length;
  const remaining    = Math.max(0, target - totalRegs);
  if (upcomingDays > 0 && remaining > 0) {
    const dailyNeeded = Math.ceil(safeDivide(remaining, upcomingDays, remaining));
    recs.push({
      id: 'rec-pace',
      priority: 'low',
      title: 'Daily Registration Pace Required',
      description: `${remaining} registrations needed in ${upcomingDays} day(s) to hit the ${target} target.`,
      action: `Maintain a pace of at least ${dailyNeeded} registrations/day across all channels`,
      metric: 'Daily Pace',
      value: `${dailyNeeded}/day`,
      confidence: 'High',
      icon: 'Clock',
    });
  }

  const order = { high: 0, medium: 1, low: 2 };
  return recs.sort((a, b) => order[a.priority] - order[b.priority]);
}
