# Implementation Plan — GrowthPilot AI

**Project:** GrowthPilot AI — Student Acquisition & Referral Intelligence Platform  
**Stack:** React 18 + JavaScript, Vite, plain CSS, Recharts, Lucide React, localStorage  
**Workspace:** `c:\GrowthPilotAi`  
**Node:** v23.10.0 · **npm:** 11.2.0

---

## Environment Notes (read before implementing)

- All commands run in **PowerShell** from `c:\GrowthPilotAi`. Use `&&` to chain; do NOT use `\n` line breaks inside a single command string.
- `npm create vite@latest` in an existing directory requires the `--` separator: `npm create vite@latest . -- --template react`. When prompted "Current directory is not empty. Remove existing files and continue?" answer **y**.
- After scaffolding, Vite puts a `public/` folder and `src/` with starter files. The cleanup step removes them before new files are written.
- Import paths are case-sensitive on Linux/macOS but not on Windows. Write them consistently (lowercase filenames, PascalCase component names) to avoid build failures when the project is graded on a different OS.
- `recharts` and `lucide-react` are both ESM packages. No special Vite config is needed for them.
- Do **not** add `"type":"module"` manually — Vite's `react` template already handles this.
- All monetary amounts are in Indian Rupees (₹). Use Unicode `\u20B9` or the literal `₹` in JSX string literals.
- The store must hydrate from localStorage **before** rendering the app to avoid a flash of seed data.
- Every division must go through `safeDivide(numerator, denominator, fallback=0)` to prevent NaN/Infinity.
- The "DEMO DATA — SIMULATED CAMPAIGN" badge must be visible on every page.
- No React Router — navigation is controlled by a single `useState` in `App.jsx`.

---

## Implementation Plan

- [ ] 1. **Scaffold Vite React project**

  Run `npm create vite@latest . -- --template react` inside `c:\GrowthPilotAi`, answering `y` to the "directory not empty" prompt. This generates `package.json`, `vite.config.js`, `index.html`, and a default `src/`.

  Files created by scaffold:
  - `package.json`, `vite.config.js`, `index.html`
  - `src/main.jsx`, `src/App.jsx`, `src/App.css`, `src/index.css`
  - `src/assets/`, `public/`

  **Command:**
  ```
  cd c:\GrowthPilotAi && npm create vite@latest . -- --template react
  ```

  **Verify:** `package.json` exists and contains `"@vitejs/plugin-react"` in devDependencies.

---

- [ ] 2. **Install production dependencies**

  Install `recharts` and `lucide-react`. These are the only two non-Vite runtime dependencies required.

  **Command:**
  ```
  cd c:\GrowthPilotAi && npm install recharts lucide-react
  ```

  **Gotcha:** npm 11 with Node 23 may show deprecation warnings about `punycode`. These are safe to ignore — they come from transitive deps in recharts and do not affect the build.

  **Verify:** `node_modules/recharts` and `node_modules/lucide-react` both exist; `npm run build` completes without missing-module errors.

---

- [ ] 3. **Clean up default Vite template files**

  Remove or empty the files that came from the template so they don't conflict with the new implementation. Keep `index.html` (edit it in step 4) and `vite.config.js` (leave unchanged).

  **Actions:**
  - Delete `src/assets/react.svg` and `public/vite.svg` (avoid broken-image references).
  - Empty `src/App.css` — the file must still exist (imported) but the template styles are not needed.
  - Empty `src/index.css` — will be replaced entirely in step 7.
  - Replace `src/App.jsx` with a minimal placeholder (one `<div>Loading…</div>`) so the project stays buildable between steps.
  - Replace `src/main.jsx` with the final version (step 5 writes the real one, but keep a valid placeholder now).

  **Verify:** `npm run build` passes with the placeholder files in place.

---

- [ ] 4. **Update `index.html`**

  Set the page title, add the viewport meta tag, and set the favicon to a generic one (or remove the broken SVG reference).

  File: `index.html`

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>GrowthPilot AI</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/src/main.jsx"></script>
    </body>
  </html>
  ```

  **Verify:** Running `npm run dev` and opening the browser shows "GrowthPilot AI" in the tab title.

---

- [ ] 5. **Create the full directory structure (empty files)**

  Create every directory and empty placeholder file so that later steps can fill them in and imports resolve. Use `New-Item -Force` in PowerShell or just create them as you write their content.

  Directories to create under `src/`:
  ```
  src/components/layout/
  src/components/ui/
  src/components/charts/
  src/modules/dashboard/
  src/modules/channels/
  src/modules/ambassadors/
  src/modules/experiments/
  src/modules/advisor/
  src/modules/planner/
  src/modules/simulator/
  src/data/
  src/store/
  ```

  Files (create empty or with a single comment):
  ```
  src/components/layout/Sidebar.jsx
  src/components/layout/Header.jsx
  src/components/layout/Layout.jsx
  src/components/ui/Toast.jsx
  src/components/ui/Modal.jsx
  src/components/ui/Badge.jsx
  src/components/ui/Tooltip.jsx
  src/components/ui/KPICard.jsx
  src/components/ui/EmptyState.jsx
  src/components/ui/LoadingSpinner.jsx
  src/components/charts/RegistrationTrendChart.jsx
  src/components/charts/ChannelBreakdownChart.jsx
  src/components/charts/FunnelChart.jsx
  src/components/charts/ExperimentComparisonChart.jsx
  src/modules/dashboard/Dashboard.jsx
  src/modules/dashboard/DailyTarget.jsx
  src/modules/channels/ChannelAnalytics.jsx
  src/modules/channels/ChannelForm.jsx
  src/modules/ambassadors/AmbassadorManager.jsx
  src/modules/ambassadors/AmbassadorForm.jsx
  src/modules/ambassadors/RegistrationTable.jsx
  src/modules/ambassadors/ReferralForm.jsx
  src/modules/experiments/ExperimentLab.jsx
  src/modules/experiments/ExperimentForm.jsx
  src/modules/experiments/VariantCard.jsx
  src/modules/advisor/AIGrowthAdvisor.jsx
  src/modules/advisor/RecommendationCard.jsx
  src/modules/planner/CampaignPlanner.jsx
  src/modules/planner/DayPlanRow.jsx
  src/modules/simulator/ScenarioSimulator.jsx
  src/data/seedData.js
  src/data/calculations.js
  src/data/recommendations.js
  src/data/csvExport.js
  src/store/useAppStore.js
  ```

  **Verify:** `npm run build` still passes (files are empty stubs, but imports haven't been added yet).

---

- [ ] 6. **Implement `src/data/seedData.js`**

  This is the authoritative data layer. All seeded values live here and are imported by the store and calculations.

  **Content:**

  ```js
  // src/data/seedData.js
  // All data is clearly labeled as SIMULATED DEMONSTRATION DATA.
  
  export const CAMPAIGN_CONFIG = {
    id: 'campaign-001',
    name: 'Build Your First AI Project in 60 Minutes',
    target: 500,
    budget: 2000,
    startDate: '2024-01-15',
    endDate: '2024-01-21',
    status: 'active',
  };
  
  export const SEED_CHANNELS = [
    { id: 'ch-001', name: 'WhatsApp & Telegram Communities', reach: 8500,  clicks: 612, registrations: 87,  spend: 0    },
    { id: 'ch-002', name: 'Student Ambassadors & Coding Clubs', reach: 4200, clicks: 389, registrations: 134, spend: 800  },
    { id: 'ch-003', name: 'LinkedIn & Targeted Outreach',      reach: 15000, clicks: 890, registrations: 62,  spend: 1100 },
  ];
  
  export const SEED_TRANSACTIONS = [
    { id: 'txn-001', channelId: 'ch-002', amount: 800,  description: 'Ambassador incentive budget',  date: '2024-01-15' },
    { id: 'txn-002', channelId: 'ch-003', amount: 800,  description: 'LinkedIn sponsored posts',     date: '2024-01-15' },
    { id: 'txn-003', channelId: 'ch-003', amount: 300,  description: 'LinkedIn retargeting ads',     date: '2024-01-18' },
  ];
  // Total spend: 1900; remaining: 100
  
  export const SEED_AMBASSADORS = [
    { id: 'amb-001', name: 'Arjun Sharma',  college: 'IIT Hyderabad',      code: 'ARJUN2024', channelId: 'ch-002', registrations: 23, status: 'active',   joinDate: '2024-01-14' },
    { id: 'amb-002', name: 'Priya Nair',    college: 'NIT Warangal',       code: 'PRIYA2024', channelId: 'ch-002', registrations: 19, status: 'active',   joinDate: '2024-01-14' },
    { id: 'amb-003', name: 'Rahul Verma',   college: 'BITS Pilani',        code: 'RAHUL2024', channelId: 'ch-002', registrations: 31, status: 'active',   joinDate: '2024-01-14' },
    { id: 'amb-004', name: 'Sneha Reddy',   college: 'Osmania University', code: 'SNEHA2024', channelId: 'ch-002', registrations: 18, status: 'active',   joinDate: '2024-01-14' },
    { id: 'amb-005', name: 'Kiran Kumar',   college: 'JNTU Hyderabad',     code: 'KIRAN2024', channelId: 'ch-002', registrations: 27, status: 'active',   joinDate: '2024-01-14' },
    { id: 'amb-006', name: 'Divya Menon',   college: 'VIT Vellore',        code: 'DIVYA2024', channelId: 'ch-002', registrations: 16, status: 'active',   joinDate: '2024-01-15' },
    { id: 'amb-007', name: 'Aditya Singh',  college: 'SRM University',     code: 'ADITY2024', channelId: 'ch-002', registrations: 0,  status: 'inactive', joinDate: '2024-01-15' },
    { id: 'amb-008', name: 'Meera Pillai',  college: 'Amrita University',  code: 'MEERA2024', channelId: 'ch-001', registrations: 12, status: 'active',   joinDate: '2024-01-14' },
  ];
  
  export const SEED_EXPERIMENTS = [
    {
      id: 'exp-001',
      name: 'Workshop Message A/B Test',
      status: 'running',
      startDate: '2024-01-15',
      isSimulated: true,
      disclaimer: 'Results are directional only. Statistical significance not established.',
      variants: [
        { id: 'var-a', label: 'Variant A', message: 'Build Your First AI Project in 60 Minutes \u2014 Join Free.', reach: 4200, clicks: 312, registrations: 47, isSimulated: true },
        { id: 'var-b', label: 'Variant B', message: 'Prepare for Placements with a Practical AI Project \u2014 Register Free.', reach: 4200, clicks: 389, registrations: 68, isSimulated: true },
      ],
    },
  ];
  
  export const SEED_DAY_PLANS = [
    { day: 1, date: '2024-01-15', target: 50,  actual: 45, activity: 'Launch WhatsApp community blast',                    channelId: 'ch-001', status: 'completed' },
    { day: 2, date: '2024-01-16', target: 70,  actual: 55, activity: 'Ambassador outreach begins \u2014 coding clubs',      channelId: 'ch-002', status: 'completed' },
    { day: 3, date: '2024-01-17', target: 80,  actual: 63, activity: 'LinkedIn sponsored post + ambassador push',           channelId: 'ch-003', status: 'completed' },
    { day: 4, date: '2024-01-18', target: 80,  actual: 58, activity: 'Mid-campaign ambassador check-in + Telegram groups',  channelId: 'ch-001', status: 'completed' },
    { day: 5, date: '2024-01-19', target: 75,  actual: 62, activity: 'LinkedIn retargeting + new ambassador codes',         channelId: 'ch-003', status: 'completed' },
    { day: 6, date: '2024-01-20', target: 70,  actual: 0,  activity: 'Final ambassador sprint \u2014 all channels',         channelId: 'ch-002', status: 'upcoming'  },
    { day: 7, date: '2024-01-21', target: 75,  actual: 0,  activity: 'Last-day urgency blast \u2014 WhatsApp + LinkedIn',   channelId: 'ch-001', status: 'upcoming'  },
  ];
  // targets sum: 50+70+80+80+75+70+75 = 500
  // actuals sum: 45+55+63+58+62+0+0   = 283
  
  // ── Synthetic registration records ────────────────────────────────────────────
  // 283 records generated deterministically (no Math.random).
  // Channel distribution: ch-001 [0–86], ch-002 [87–220], ch-003 [221–282]
  // Daily distribution: Jan15:45, Jan16:55, Jan17:63, Jan18:58, Jan19:62
  
  const FIRST_NAMES = ['Aarav','Aditya','Akash','Amit','Ananya','Anjali','Arjun','Aryan',
    'Bhavya','Chetan','Deepak','Dhruv','Divya','Gaurav','Isha','Kabir','Karan','Kavya',
    'Kunal','Lakshmi','Manish','Meera','Mohit','Nandini','Nikhil','Pankaj','Pooja','Priya',
    'Rahul','Ravi','Ritika','Rohit','Sachin','Sameer','Sandeep','Sanjay','Sara','Shivam',
    'Shreya','Sneha','Soham','Suresh','Tanvi','Tushar','Uday','Varun','Vijay','Vinay',
    'Vishal','Yash'];
  
  const LAST_NAMES = ['Agarwal','Bhat','Choudhary','Das','Desai','Dubey','Gandhi','Garg',
    'Gupta','Iyer','Jain','Joshi','Kapoor','Kaur','Khan','Kumar','Mehta','Mishra','Nair',
    'Patel','Pillai','Rao','Reddy','Sharma','Singh','Sinha','Tiwari','Verma','Yadav','Jha'];
  
  const COLLEGES = ['IIT Hyderabad','NIT Warangal','BITS Pilani','Osmania University',
    'JNTU Hyderabad','VIT Vellore','SRM University','Amrita University','IIIT Hyderabad',
    'Manipal Institute of Technology','PSG College of Technology','Thapar University',
    'RV College of Engineering','BMS College of Engineering','College of Engineering Pune'];
  
  const AMBASSADOR_CODES = ['ARJUN2024','PRIYA2024','RAHUL2024','SNEHA2024','KIRAN2024','DIVYA2024','MEERA2024'];
  
  // Date assignment: first 45 → Jan 15, next 55 → Jan 16, etc.
  const DATE_RANGES = [
    { date: '2024-01-15', start: 0,   end: 44  },
    { date: '2024-01-16', start: 45,  end: 99  },
    { date: '2024-01-17', start: 100, end: 162 },
    { date: '2024-01-18', start: 163, end: 220 },
    { date: '2024-01-19', start: 221, end: 282 },
  ];
  
  function getDate(index) {
    for (const r of DATE_RANGES) {
      if (index >= r.start && index <= r.end) return r.date;
    }
    return '2024-01-19';
  }
  
  function getChannel(index) {
    if (index <= 86)  return 'ch-001';
    if (index <= 220) return 'ch-002';
    return 'ch-003';
  }
  
  function getReferralCode(index) {
    if (index >= 87 && index <= 220) return AMBASSADOR_CODES[index % AMBASSADOR_CODES.length];
    if (index >= 0  && index <= 86)  return (index % 8 === 7) ? 'MEERA2024' : null;
    return null;
  }
  
  export const SEED_REGISTRATIONS = Array.from({ length: 283 }, (_, i) => {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last  = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length];
    const college = COLLEGES[i % COLLEGES.length];
    const channelId = getChannel(i);
    const date = getDate(i);
    return {
      id:           `reg-${String(i + 1).padStart(4, '0')}`,
      name:         `${first} ${last}`,
      email:        `${first.toLowerCase()}.${last.toLowerCase()}${i}@demo.edu`,
      college,
      channelId,
      referralCode: getReferralCode(i),
      date,
      isSimulated:  true,
    };
  });
  ```

  **Invariants to verify in the browser console after the app loads:**
  - `SEED_REGISTRATIONS.length === 283`
  - `SEED_REGISTRATIONS.filter(r => r.channelId === 'ch-001').length === 87`
  - `SEED_REGISTRATIONS.filter(r => r.channelId === 'ch-002').length === 134`
  - `SEED_REGISTRATIONS.filter(r => r.channelId === 'ch-003').length === 62`
  - `SEED_DAY_PLANS.reduce((s,d) => s+d.target, 0) === 500`
  - `SEED_DAY_PLANS.reduce((s,d) => s+d.actual, 0) === 283`
  - `SEED_TRANSACTIONS.reduce((s,t) => s+t.amount, 0) === 1900`

  **Verify:** `npm run build` passes.

---

- [ ] 7. **Implement `src/data/calculations.js`**

  Pure functions only — no imports from the store. All inputs come as parameters. Every division uses `safeDivide`.

  ```js
  // src/data/calculations.js

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
    if (!channels.length) return null;
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
      date:    dp.date,
      day:     dp.day,
      target:  dp.target,
      actual:  dp.actual,
      planned: dp.target,
      // also count live registrations for this date
      liveCount: registrations.filter(r => r.date === dp.date).length,
    }));
  }

  export function getChannelStats(channel, registrations) {
    const regs = registrations.filter(r => r.channelId === channel.id).length;
    const total = registrations.length;
    return {
      ...channel,
      registrations: regs,
      ctr:           getCTR(channel.clicks, channel.reach),
      conversionRate: getConversionRate(regs, channel.clicks),
      cpr:           getCPR(channel.spend, regs),
      share:         safeDivide(regs, total) * 100,
    };
  }

  export function getDailyPaceNeeded(registrations, target, daysRemaining) {
    const remaining = getRemainingRegistrations(registrations, target);
    return safeDivide(remaining, daysRemaining, remaining);
  }
  ```

  **Verify:** `npm run build` passes.

---

- [ ] 8. **Implement `src/data/recommendations.js`**

  Rule-based recommendation engine. Takes the full app state as input and returns a sorted array of recommendation objects. Rules are numbered to match the spec.

  ```js
  // src/data/recommendations.js
  import { getCPR, getConversionRate, safeDivide } from './calculations.js';

  const PRIORITY = { HIGH: 1, MEDIUM: 2, LOW: 3 };

  function makeRec(priority, title, detail, channelName = null) {
    return { priority, title, detail, channelName, timestamp: new Date().toISOString() };
  }

  export function generateRecommendations(state) {
    const { channels, registrations, transactions, experiments, dayPlans, campaign } = state;
    const recs = [];

    const totalRegs   = registrations.length;
    const totalSpent  = transactions.reduce((s, t) => s + t.amount, 0);
    const budget      = campaign.budget;
    const target      = campaign.target;

    // ── Per-channel metrics ───────────────────────────────────────────────────
    const channelStats = channels.map(ch => {
      const regs = registrations.filter(r => r.channelId === ch.id).length;
      return { ...ch, regs, cpr: getCPR(ch.spend, regs), conv: getConversionRate(regs, ch.clicks) };
    });
    const channelsWithSpend = channelStats.filter(c => c.spend > 0 && c.regs > 0);
    const avgCPR = channelsWithSpend.length
      ? channelsWithSpend.reduce((s, c) => s + c.cpr, 0) / channelsWithSpend.length
      : 0;

    // Rule 1: Best CPR channel is 20%+ better than average
    if (avgCPR > 0) {
      const best = channelsWithSpend.reduce((b, c) => (c.cpr < b.cpr ? c : b), channelsWithSpend[0]);
      if (best && best.cpr < avgCPR * 0.8) {
        recs.push(makeRec('HIGH', `Double down on ${best.name}`,
          `Cost per registration (₹${best.cpr.toFixed(2)}) is 20%+ better than the channel average (₹${avgCPR.toFixed(2)}).`,
          best.name));
      }
    }

    // Rule 2: High clicks but low conversion
    channelStats.forEach(ch => {
      if (ch.clicks > 200 && ch.conv < 10) {
        recs.push(makeRec('HIGH', `Fix drop-off on ${ch.name}`,
          `${ch.clicks} clicks but only ${ch.conv.toFixed(1)}% click-to-registration conversion. Review the landing page or message.`,
          ch.name));
      }
    });

    // Rule 3: Campaign behind target
    const completedDays = dayPlans.filter(d => d.status === 'completed');
    const plannedSoFar  = completedDays.reduce((s, d) => s + d.target, 0);
    if (plannedSoFar > 0 && totalRegs < plannedSoFar * 0.6) {
      recs.push(makeRec('HIGH', 'Campaign is behind target',
        `Only ${totalRegs} registrations against ${plannedSoFar} planned so far (${((totalRegs / plannedSoFar) * 100).toFixed(0)}% of pace). Increase outreach intensity.`));
    }

    // Rule 4: Budget nearly depleted
    const budgetUsedPct = safeDivide(totalSpent, budget) * 100;
    if (budgetUsedPct >= 90) {
      recs.push(makeRec('HIGH', 'Budget nearly depleted — focus free channels',
        `${budgetUsedPct.toFixed(0)}% of ₹${budget} spent. Shift effort to zero-cost channels like WhatsApp communities.`));
    }

    // Rule 5: Experiment has fewer than 100 observations per variant
    experiments.forEach(exp => {
      exp.variants.forEach(v => {
        if (v.registrations < 100) {
          recs.push(makeRec('MEDIUM', 'Collect more A/B test data',
            `${v.label} in "${exp.name}" has only ${v.registrations} registrations. Aim for ≥100 per variant before drawing conclusions.`));
        }
      });
    });

    // Rule 6: Variant B beats Variant A on conversion
    experiments.forEach(exp => {
      if (exp.variants.length === 2) {
        const [a, b] = exp.variants;
        const convA = getConversionRate(a.registrations, a.clicks);
        const convB = getConversionRate(b.registrations, b.clicks);
        if (convB > convA) {
          recs.push(makeRec('MEDIUM', `Consider adopting ${b.label} messaging`,
            `${b.label} conversion: ${convB.toFixed(1)}% vs ${a.label}: ${convA.toFixed(1)}%. Directional advantage — not yet statistically significant.`));
        }
      }
    });

    // Rule 7: Ambassador channel high volume but worst CPR
    const ambChannel = channelStats.find(c => c.id === 'ch-002');
    if (ambChannel && channelsWithSpend.length > 1) {
      const worstCPR = Math.max(...channelsWithSpend.map(c => c.cpr));
      if (ambChannel.cpr === worstCPR && ambChannel.regs > 50) {
        recs.push(makeRec('MEDIUM', 'Review ambassador incentive cost',
          `Ambassador channel has high volume (${ambChannel.regs} regs) but the highest CPR (₹${ambChannel.cpr.toFixed(2)}). Consider renegotiating incentives.`));
      }
    }

    // Rule 8: High-reach channel with <1% registration rate
    channelStats.forEach(ch => {
      const regRate = safeDivide(ch.regs, ch.reach) * 100;
      if (ch.reach > 10000 && regRate < 1) {
        recs.push(makeRec('MEDIUM', `Low conversion on high-reach channel: ${ch.name}`,
          `Reach: ${ch.reach.toLocaleString()}, registrations: ${ch.regs} (${regRate.toFixed(2)}%). Refine targeting or messaging for better ROI.`,
          ch.name));
      }
    });

    // Rule 9: Always — daily pace needed
    const upcomingDays = dayPlans.filter(d => d.status === 'upcoming').length;
    const remaining    = Math.max(0, target - totalRegs);
    if (upcomingDays > 0 && remaining > 0) {
      const dailyNeeded = Math.ceil(remaining / upcomingDays);
      recs.push(makeRec('LOW', `Need ${dailyNeeded} registrations/day to hit ${target}`,
        `${remaining} registrations remaining over ${upcomingDays} day(s). Current daily pace must increase to meet the goal.`));
    }

    recs.sort((a, b) => PRIORITY[a.priority] - PRIORITY[b.priority]);
    return recs;
  }
  ```

  **Verify:** `npm run build` passes.

---

- [ ] 9. **Implement `src/data/csvExport.js`**

  Utility to export registrations and channel data as CSV files using the browser's download mechanism.

  ```js
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

  export function exportRegistrationsCSV(registrations, channels) {
    const channelMap = Object.fromEntries(channels.map(c => [c.id, c.name]));
    const header = ['ID', 'Name', 'Email', 'College', 'Channel', 'Referral Code', 'Date', 'Simulated'];
    const rows = registrations.map(r => [
      r.id, r.name, r.email, r.college || '',
      channelMap[r.channelId] || r.channelId,
      r.referralCode || '', r.date, r.isSimulated ? 'Yes' : 'No',
    ]);
    const csv = [header, ...rows].map(rowToCSV).join('\n');
    downloadCSV(csv, 'registrations.csv');
  }

  export function exportChannelsCSV(channels, registrations) {
    const header = ['ID', 'Channel', 'Reach', 'Clicks', 'Registrations', 'Spend (INR)', 'CTR %', 'Conv %', 'CPR'];
    const rows = channels.map(ch => {
      const regs = registrations.filter(r => r.channelId === ch.id).length;
      const ctr  = ch.reach  ? ((ch.clicks / ch.reach)  * 100).toFixed(2) : '0.00';
      const conv = ch.clicks ? ((regs / ch.clicks) * 100).toFixed(2) : '0.00';
      const cpr  = regs      ? (ch.spend / regs).toFixed(2) : '0.00';
      return [ch.id, ch.name, ch.reach, ch.clicks, regs, ch.spend, ctr, conv, cpr];
    });
    const csv = [header, ...rows].map(rowToCSV).join('\n');
    downloadCSV(csv, 'channel-analytics.csv');
  }

  function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  ```

  **Verify:** `npm run build` passes.

---

- [ ] 10. **Implement `src/store/useAppStore.js`**

  React Context + useReducer pattern. Hydrates from localStorage on mount; persists on every dispatch. Exposes `{ state, dispatch, toast, addToast, removeToast }` via `useAppStore()` hook.

  Key design decisions:
  - localStorage key: `'growthpilot-state'`
  - Initial state is loaded from localStorage if present, otherwise falls back to seed data.
  - Toast queue is kept in a separate `useReducer` (not persisted) to avoid stale toasts on page reload.
  - `RESET_TO_SEED` restores the full seed state and clears localStorage.

  ```js
  // src/store/useAppStore.js
  import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
  import {
    CAMPAIGN_CONFIG, SEED_CHANNELS, SEED_REGISTRATIONS, SEED_AMBASSADORS,
    SEED_EXPERIMENTS, SEED_DAY_PLANS, SEED_TRANSACTIONS,
  } from '../data/seedData.js';

  const STORAGE_KEY = 'growthpilot-state';

  const SEED_STATE = {
    campaign:      CAMPAIGN_CONFIG,
    channels:      SEED_CHANNELS,
    registrations: SEED_REGISTRATIONS,
    ambassadors:   SEED_AMBASSADORS,
    experiments:   SEED_EXPERIMENTS,
    dayPlans:      SEED_DAY_PLANS,
    transactions:  SEED_TRANSACTIONS,
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : SEED_STATE;
    } catch {
      return SEED_STATE;
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* quota exceeded — silently skip */ }
  }

  function appReducer(state, action) {
    switch (action.type) {
      case 'ADD_REGISTRATION': {
        const emailLower = action.payload.email.toLowerCase();
        const duplicate = state.registrations.some(r => r.email.toLowerCase() === emailLower);
        if (duplicate) throw new Error(`A registration with email ${action.payload.email} already exists.`);
        return { ...state, registrations: [...state.registrations, action.payload] };
      }
      case 'REMOVE_REGISTRATION':
        return { ...state, registrations: state.registrations.filter(r => r.id !== action.payload) };

      case 'ADD_AMBASSADOR':
        return { ...state, ambassadors: [...state.ambassadors, action.payload] };
      case 'UPDATE_AMBASSADOR':
        return { ...state, ambassadors: state.ambassadors.map(a => a.id === action.payload.id ? { ...a, ...action.payload } : a) };
      case 'DELETE_AMBASSADOR':
        return { ...state, ambassadors: state.ambassadors.filter(a => a.id !== action.payload) };

      case 'ADD_CHANNEL':
        return { ...state, channels: [...state.channels, action.payload] };
      case 'UPDATE_CHANNEL':
        return { ...state, channels: state.channels.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) };

      case 'ADD_EXPERIMENT':
        return { ...state, experiments: [...state.experiments, action.payload] };
      case 'UPDATE_EXPERIMENT':
        return { ...state, experiments: state.experiments.map(e => e.id === action.payload.id ? { ...e, ...action.payload } : e) };
      case 'UPDATE_VARIANT':
        return {
          ...state,
          experiments: state.experiments.map(exp =>
            exp.id === action.payload.experimentId
              ? { ...exp, variants: exp.variants.map(v => v.id === action.payload.variantId ? { ...v, ...action.payload.data } : v) }
              : exp
          ),
        };

      case 'UPDATE_DAY_PLAN':
        return { ...state, dayPlans: state.dayPlans.map(d => d.day === action.payload.day ? { ...d, ...action.payload } : d) };

      case 'ADD_TRANSACTION':
        return { ...state, transactions: [...state.transactions, action.payload] };

      case 'RESET_TO_SEED':
        localStorage.removeItem(STORAGE_KEY);
        return { ...SEED_STATE };

      default:
        return state;
    }
  }

  // ── Toast reducer ──────────────────────────────────────────────────────────
  function toastReducer(toasts, action) {
    switch (action.type) {
      case 'ADD':    return [...toasts.slice(-2), action.payload]; // max 3 visible
      case 'REMOVE': return toasts.filter(t => t.id !== action.payload);
      default:       return toasts;
    }
  }

  // ── Context ────────────────────────────────────────────────────────────────
  const AppContext = createContext(null);

  export function AppProvider({ children }) {
    const [state,    dispatch]      = useReducer(appReducer,    null, loadState);
    const [toasts,   toastDispatch] = useReducer(toastReducer,  []);

    useEffect(() => { saveState(state); }, [state]);

    const addToast = useCallback((message, type = 'info') => {
      const id = `toast-${Date.now()}`;
      toastDispatch({ type: 'ADD', payload: { id, message, type } });
      setTimeout(() => toastDispatch({ type: 'REMOVE', payload: id }), 3000);
    }, []);

    const removeToast = useCallback((id) => {
      toastDispatch({ type: 'REMOVE', payload: id });
    }, []);

    // Wrap dispatch to catch errors (e.g. duplicate email) and surface as toasts
    const safeDispatch = useCallback((action) => {
      try {
        dispatch(action);
      } catch (err) {
        addToast(err.message, 'error');
      }
    }, [addToast]);

    return (
      <AppContext.Provider value={{ state, dispatch: safeDispatch, toasts, addToast, removeToast }}>
        {children}
      </AppContext.Provider>
    );
  }

  export function useAppStore() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useAppStore must be used inside AppProvider');
    return ctx;
  }
  ```

  **Verify:** `npm run build` passes.

---

- [ ] 11. **Implement global styles — `src/index.css` and `src/App.css`**

  `index.css` sets the design token variables, resets, and base typography.
  `App.css` contains the app shell layout (sidebar + main content area).

  **`src/index.css`** — define CSS custom properties used by every component:

  ```css
  /* src/index.css — design tokens and resets */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:            #F8F9FC;
    --surface:       #FFFFFF;
    --sidebar-bg:    #0F172A;
    --sidebar-text:  #CBD5E1;
    --sidebar-active:#FFFFFF;
    --accent:        #6366F1;
    --accent-light:  #EEF2FF;
    --text-primary:  #0F172A;
    --text-secondary:#64748B;
    --border:        #E2E8F0;
    --success:       #10B981;
    --warning:       #F59E0B;
    --error:         #EF4444;
    --info:          #3B82F6;
    --chart-1:       #6366F1;
    --chart-2:       #10B981;
    --chart-3:       #F59E0B;
    --chart-4:       #EF4444;
    --chart-5:       #3B82F6;
    --chart-6:       #8B5CF6;
    --card-shadow:   0 1px 3px rgba(0,0,0,0.08);
    --radius-card:   8px;
    --radius-btn:    6px;
    --font:          -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    --font-size-base:14px;
  }

  html { font-size: var(--font-size-base); }
  body { font-family: var(--font); background: var(--bg); color: var(--text-primary); line-height: 1.5; }
  button { font-family: inherit; cursor: pointer; }
  input, select, textarea { font-family: inherit; }
  a { color: var(--accent); }
  ```

  **`src/App.css`** — app shell layout:

  ```css
  /* src/App.css — app shell */
  .app-shell {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  .app-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--bg);
  }

  .app-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }

  /* Scrollbar styling */
  .app-content::-webkit-scrollbar { width: 6px; }
  .app-content::-webkit-scrollbar-track { background: transparent; }
  .app-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  ```

  **Verify:** `npm run build` passes.

---

- [ ] 12. **Implement `src/main.jsx`**

  Entry point. Wraps `App` in `AppProvider`.

  ```jsx
  // src/main.jsx
  import { StrictMode } from 'react';
  import { createRoot } from 'react-dom/client';
  import './index.css';
  import App from './App.jsx';
  import { AppProvider } from './store/useAppStore.js';

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </StrictMode>
  );
  ```

  **Verify:** `npm run build` passes.

---

- [ ] 13. **Implement UI primitives: `Toast.jsx`, `Modal.jsx`, `Badge.jsx`, `Tooltip.jsx`, `KPICard.jsx`, `EmptyState.jsx`, `LoadingSpinner.jsx`**

  These are small, self-contained components. Implement them together in one step because they have no dependencies on each other and are needed by every module.

  ### `src/components/ui/Toast.jsx`
  - Positioned fixed, bottom-right.
  - Uses `useAppStore` to read `toasts` and `removeToast`.
  - Each toast has a colored left border matching its type (success/error/warning/info).
  - Animated slide-in with CSS transition.
  - Has a close (×) button.

  ### `src/components/ui/Modal.jsx`
  - Props: `isOpen`, `onClose`, `title`, `children`, `size` ('sm'|'md'|'lg').
  - Backdrop click closes the modal.
  - `Escape` key closes the modal (useEffect with keydown listener).
  - Uses a portal (`createPortal`) to render outside the component tree.
  - Has a header with title and close button.

  ### `src/components/ui/Badge.jsx`
  - Props: `label`, `variant` ('success'|'warning'|'error'|'info'|'neutral'|'accent').
  - Small pill shape. Uses CSS variables for colors.

  ### `src/components/ui/Tooltip.jsx`
  - Wraps children; shows a tooltip above on hover.
  - Props: `content` (string), `children`.
  - Pure CSS hover tooltip (no JS positioning needed for simple cases).

  ### `src/components/ui/KPICard.jsx`
  - Props: `title`, `value`, `subtitle`, `icon` (Lucide component), `trend` (optional: `{ direction: 'up'|'down', label }` ), `accentColor`.
  - Renders a card with icon, large value, subtitle, and optional trend indicator.
  - Uses `--card-shadow` and `--radius-card`.

  ### `src/components/ui/EmptyState.jsx`
  - Props: `icon`, `title`, `description`, `action` (optional: `{ label, onClick }`).
  - Centered layout with icon, title, description, and optional CTA button.

  ### `src/components/ui/LoadingSpinner.jsx`
  - Simple CSS-animated spinning circle using `border` and `border-top-color`.
  - Props: `size` ('sm'|'md'|'lg').

  **Verify:** `npm run build` passes.

---

- [ ] 14. **Implement layout components: `Sidebar.jsx`, `Header.jsx`, `Layout.jsx`**

  ### `src/components/layout/Sidebar.jsx`
  - Props: `activePage`, `onNavigate`.
  - Background: `--sidebar-bg` (#0F172A).
  - Top: "GrowthPilot AI" logo text + small rocket/chart icon (Lucide `Rocket` or `BarChart2`).
  - Nav items (use Lucide icons):
    - Dashboard (`LayoutDashboard`)
    - Channels (`Layers`)
    - Ambassadors (`Users`)
    - Experiments (`FlaskConical`)
    - AI Advisor (`Brain`)
    - Campaign Planner (`Calendar`)
    - Scenario Simulator (`Sliders`)
  - Active item: white text, `--accent` left border (3px), `--accent-light` at 10% opacity background.
  - Inactive item: `--sidebar-text` color, hover lightens slightly.
  - Bottom: "DEMO DATA" badge (amber/warning color, small), and a "Reset to Seed" button.
  - Collapsible: add a toggle button (chevron) that collapses sidebar to icon-only mode (64px wide vs 220px). Store collapsed state in local component state (not persisted).

  ### `src/components/layout/Header.jsx`
  - Props: `activePage`, `pageTitle`.
  - Top bar: page breadcrumb/title on the left.
  - Center or right: **"DEMO DATA — SIMULATED CAMPAIGN"** badge (always visible, amber background).
  - Right: a "Reset Data" button that dispatches `RESET_TO_SEED` with a confirmation dialog (`window.confirm`).
  - Height: 56px. Border-bottom: `1px solid var(--border)`. Background: `var(--surface)`.

  ### `src/components/layout/Layout.jsx`
  - Composes Sidebar + Header + main content area + Toast overlay.
  - Props: `activePage`, `onNavigate`, `children`.
  - Renders `<Toast />` at the root so it overlays everything.

  **Verify:** `npm run build` passes.

---

- [ ] 15. **Implement chart components**

  All charts use Recharts. Keep chart components pure (accept data as props, no store access).

  ### `src/components/charts/RegistrationTrendChart.jsx`
  - Props: `data` (array of `{ date, actual, target }`).
  - `ComposedChart` with `Bar` (actual, color `--chart-1`) and `Line` (target, dashed, color `--chart-3`).
  - `XAxis` shows abbreviated date (e.g. "Jan 15"). `YAxis`. `Tooltip`. `Legend`.
  - `ResponsiveContainer` width 100%, height 220.

  ### `src/components/charts/ChannelBreakdownChart.jsx`
  - Props: `data` (array of `{ name, registrations, clicks }`).
  - `BarChart` with two bars: registrations (--chart-1) and clicks (--chart-2), grouped.
  - Or a `PieChart` variant selectable by a `chartType` prop ('bar'|'pie').
  - `ResponsiveContainer` height 200.

  ### `src/components/charts/FunnelChart.jsx`
  - Props: `data` (array of `{ label, value }` — reach, clicks, registrations).
  - Since Recharts does not have a native funnel chart, implement as a horizontal `BarChart` with a single bar per stage, descending values.
  - Show value labels on each bar. Color: `--chart-1`.

  ### `src/components/charts/ExperimentComparisonChart.jsx`
  - Props: `variants` (array of variant objects), `metric` ('ctr'|'conversion'|'registrations').
  - `BarChart` comparing two variants side by side on the selected metric.
  - Winner bar highlighted with `--success`; loser with `--chart-1`.
  - `ResponsiveContainer` height 200.

  **Verify:** `npm run build` passes.

---

- [ ] 16. **Implement `src/App.jsx`**

  Top-level component. Manages active page via `useState`. Renders `<Layout>` with the active module.

  ```jsx
  // src/App.jsx
  import { useState } from 'react';
  import './App.css';
  import Layout from './components/layout/Layout.jsx';
  import Dashboard       from './modules/dashboard/Dashboard.jsx';
  import ChannelAnalytics from './modules/channels/ChannelAnalytics.jsx';
  import AmbassadorManager from './modules/ambassadors/AmbassadorManager.jsx';
  import ExperimentLab   from './modules/experiments/ExperimentLab.jsx';
  import AIGrowthAdvisor from './modules/advisor/AIGrowthAdvisor.jsx';
  import CampaignPlanner from './modules/planner/CampaignPlanner.jsx';
  import ScenarioSimulator from './modules/simulator/ScenarioSimulator.jsx';

  const PAGE_TITLES = {
    dashboard:   'Growth Command Center',
    channels:    'Channel Analytics',
    ambassadors: 'Ambassador Referral Intelligence',
    experiments: 'Growth Experiment Lab',
    advisor:     'AI Growth Advisor',
    planner:     'Campaign Planner',
    simulator:   'Scenario Simulator',
  };

  const PAGES = {
    dashboard:   Dashboard,
    channels:    ChannelAnalytics,
    ambassadors: AmbassadorManager,
    experiments: ExperimentLab,
    advisor:     AIGrowthAdvisor,
    planner:     CampaignPlanner,
    simulator:   ScenarioSimulator,
  };

  export default function App() {
    const [activePage, setActivePage] = useState('dashboard');
    const ActiveModule = PAGES[activePage] || Dashboard;

    return (
      <Layout activePage={activePage} onNavigate={setActivePage} pageTitle={PAGE_TITLES[activePage]}>
        <ActiveModule />
      </Layout>
    );
  }
  ```

  **Verify:** `npm run build` passes. App renders in browser without console errors.

---

- [ ] 17. **Implement Module A — `Dashboard.jsx` and `DailyTarget.jsx`**

  This is the most data-dense module. Read from the store; use calculations.js for all derived metrics.

  ### `src/modules/dashboard/Dashboard.jsx`

  Sections (top to bottom):
  1. **KPI row** — 8 `KPICard` components:
     - Registration Target (500, static)
     - Total Registrations (`getTotalRegistrations`)
     - Completion % (`getRegistrationCompletion`)
     - Remaining (`getRemainingRegistrations`)
     - Campaign Budget (₹2,000)
     - Amount Spent / Remaining (from `getTotalSpent` / `getBudgetRemaining`)
     - Cost Per Registration (`getCPR(totalSpent, totalRegs)`)
     - Conversion Rate (total registrations / total clicks across all channels)

  2. **Progress bar** — large visual bar showing % toward 500. Label shows "X / 500 registrations".

  3. **Charts row** (3 columns):
     - `RegistrationTrendChart` (daily actual vs target)
     - `ChannelBreakdownChart` (registrations by channel)
     - `FunnelChart` (reach → clicks → registrations totals)

  4. **Best channel highlight** — a small card showing the best channel by the selected metric (dropdown to switch metric). Use `getBestChannel`.

  5. **Recent activity** — last 5 registrations from the store, shown as a compact list (name, channel, date).

  6. **Top recommendation** — the first HIGH-priority recommendation from `generateRecommendations`, rendered with `RecommendationCard`.

  Add a channel filter (dropdown) and date range filter (select: All / Day 1–5) at the top of the page. Filters affect the charts and recent activity list, not the KPI cards (KPIs always reflect total campaign state).

  ### `src/modules/dashboard/DailyTarget.jsx`

  A compact sub-component showing today's target vs actual as a mini progress bar with a label. Used inside Dashboard.

  **Verify:** `npm run build` passes. Dashboard renders with all 8 KPI values populated from data.

---

- [ ] 18. **Implement Module B — `ChannelAnalytics.jsx` and `ChannelForm.jsx`**

  ### `src/modules/channels/ChannelAnalytics.jsx`

  Layout:
  - Top: page title + "Add Channel" button.
  - Channel cards grid (3 columns): one card per channel. Each card shows:
    - Channel name, icon.
    - Reach, Clicks, Registrations (labeled clearly: "Estimated Reach", "Link Clicks", "Unique Registrations").
    - CTR %, Conversion Rate %, CPR (₹).
    - Spend (₹).
    - Contribution % (share of total registrations).
    - "Edit" button.
    - Each metric label has a `<Tooltip>` explaining how it's calculated.
  - Below cards: a summary table with all channels in rows and all metrics in columns.
  - Note below the table: "Estimated reach is self-reported and may differ from platform analytics."

  ### `src/modules/channels/ChannelForm.jsx`
  - Props: `channel` (null for add, existing object for edit), `onSave`, `onClose`.
  - Form fields: Name (text), Reach (number), Clicks (number), Spend (₹, number). Registrations field is read-only (calculated from actual registrations). ID is auto-generated for new channels.
  - Validation: name required, reach/clicks/spend ≥ 0.
  - Dispatches `ADD_CHANNEL` or `UPDATE_CHANNEL`.
  - Rendered inside `<Modal>`.

  **Verify:** `npm run build` passes. Add a new channel; KPI cards on Dashboard update.

---

- [ ] 19. **Implement Module C — `AmbassadorManager.jsx`, `AmbassadorForm.jsx`, `RegistrationTable.jsx`, `ReferralForm.jsx`**

  ### `src/modules/ambassadors/AmbassadorManager.jsx`
  - Two tabs: "Ambassadors" and "Registrations".
  - Ambassadors tab:
    - Sort controls (by name, registrations, status).
    - Filter by channel, status.
    - "Add Ambassador" button.
    - Ambassador cards or table rows: name, college, code (with "Copy" icon button), channel, registrations count, status badge, join date, "Edit" / "Delete" buttons.
    - Delete shows `window.confirm` before dispatching.
    - Top ambassadors highlighted (top 3 by registrations get a "⭐ Top" badge).
  - Registrations tab: renders `<RegistrationTable />`.

  ### `src/modules/ambassadors/AmbassadorForm.jsx`
  - Props: `ambassador` (null for add), `onSave`, `onClose`.
  - Fields: Name, College, Channel (select from store channels), Status (active/inactive).
  - Code is auto-generated on "Add" (first 5 chars of name, uppercased + '2024'; ensure uniqueness by appending a counter). Shown as read-only on Edit.
  - Dispatches `ADD_AMBASSADOR` or `UPDATE_AMBASSADOR`.
  - Rendered inside `<Modal>`.

  ### `src/modules/ambassadors/RegistrationTable.jsx`
  - Shows all registrations from the store.
  - Columns: ID, Name, Email, Channel, Referral Code, Date, (Simulated badge).
  - Pagination: 20 rows per page.
  - Filter by channel, date.
  - "Export CSV" button → calls `exportRegistrationsCSV`.
  - "Add Demo Registration" button → opens `<ReferralForm>`.

  ### `src/modules/ambassadors/ReferralForm.jsx`
  - Fields: Name (text), Email (text, required, validated with regex), Channel (select), Referral Code (optional text — must match an existing ambassador code or be left blank).
  - On submit: checks for duplicate email (case-insensitive), shows error toast if duplicate. Otherwise dispatches `ADD_REGISTRATION`.
  - Generates a new ID as `reg-${Date.now()}`.

  **Verify:** `npm run build` passes. Add a registration; verify it appears in the table. Try adding a duplicate email; verify the error toast appears.

---

- [ ] 20. **Implement Module D — `ExperimentLab.jsx`, `ExperimentForm.jsx`, `VariantCard.jsx`**

  ### `src/modules/experiments/ExperimentLab.jsx`
  - Lists all experiments from the store.
  - "Create Experiment" button.
  - For each experiment:
    - Name, status badge, start date.
    - Simulated data disclaimer banner (always visible if `exp.isSimulated`).
    - Metric selector (CTR / Conversion / Registrations).
    - Side-by-side `<VariantCard>` components.
    - `<ExperimentComparisonChart>` showing the two variants on the selected metric.
    - Conversion rate difference (e.g. "+2.3pp" in green or red).
    - Statistical significance disclaimer: always shown, non-dismissible.
    - "Edit" button per experiment.

  ### `src/modules/experiments/VariantCard.jsx`
  - Props: `variant`, `isWinner` (bool), `metric`.
  - Shows: label, message copy (quoted), reach, clicks, registrations, CTR %, conversion %.
  - If `isWinner`: green border, "Winner (by [metric])" badge.
  - All metrics labeled as simulated if `variant.isSimulated`.

  ### `src/modules/experiments/ExperimentForm.jsx`
  - Props: `experiment` (null for new), `onSave`, `onClose`.
  - Fields: Experiment name, status (select), start date.
  - For each variant: label, message (textarea), reach, clicks, registrations.
  - Dispatches `ADD_EXPERIMENT` or `UPDATE_EXPERIMENT`.
  - For editing individual variant metrics, dispatches `UPDATE_VARIANT`.
  - Rendered inside `<Modal>`.

  **Verify:** `npm run build` passes. Edit Variant B registrations to 100; verify conversion rates recalculate.

---

- [ ] 21. **Implement Module E — `AIGrowthAdvisor.jsx` and `RecommendationCard.jsx`**

  ### `src/modules/advisor/AIGrowthAdvisor.jsx`
  - Header: title + "Refresh" button (re-runs `generateRecommendations` on click).
  - Data freshness note: "Analysis based on current dataset — last updated: [timestamp]".
  - Groups recommendations by priority: HIGH, MEDIUM, LOW sections.
  - Each section has a count badge.
  - If no recommendations in a priority group, show a small "No issues found" note.
  - Uses `<RecommendationCard>` for each recommendation.

  ### `src/modules/advisor/RecommendationCard.jsx`
  - Props: `rec` (`{ priority, title, detail, channelName }`).
  - Priority badge: HIGH=red, MEDIUM=amber, LOW=blue.
  - Title bold, detail text smaller.
  - If `channelName` is set, show a channel tag.
  - Subtle left border color matching priority.

  **Verify:** `npm run build` passes. Advisor shows at least 4 recommendations on initial load.

---

- [ ] 22. **Implement Module F — `CampaignPlanner.jsx` and `DayPlanRow.jsx`**

  ### `src/modules/planner/CampaignPlanner.jsx`
  - Top summary: total planned (500), total actual (283), overall gap.
  - `RegistrationTrendChart` showing planned vs actual for all 7 days.
  - Table of 7 days: each row is a `<DayPlanRow>`.
  - "Export Plan" button → downloads a CSV of the day plan.

  ### `src/modules/planner/DayPlanRow.jsx`
  - Props: `day` (day plan object), `onEdit`.
  - Displays: Day number, date, target, actual, gap (target-actual, colored red if negative or 0 and status is completed), activity description, channel badge, status badge.
  - "Edit" button (pencil icon) opens an inline edit form or a `<Modal>` with fields: target (number), actual (number), activity (text), channel (select), status (select: upcoming/active/completed).
  - Dispatches `UPDATE_DAY_PLAN`.

  **Verify:** `npm run build` passes. Edit Day 6 actual to 40; chart updates.

---

- [ ] 23. **Implement Module G — `ScenarioSimulator.jsx`**

  ### `src/modules/simulator/ScenarioSimulator.jsx`

  This module lets the user explore "what if" scenarios using sliders. It does NOT modify the store.

  Layout:
  - Three channel panels (one per channel), each with sliders for:
    - Reach (min: current reach × 0.5, max: current reach × 3, step: 100).
    - Click-through rate % (0–20%, step: 0.1).
    - Conversion rate % (0–30%, step: 0.1).
    - Spend (₹0–₹2000, step: 50).
  - "Reset to Current" button per channel restores sliders to the channel's actual values.
  - Live projected totals panel (updates as sliders change):
    - Projected clicks per channel.
    - Projected registrations per channel.
    - Total projected registrations.
    - Projected total spend.
    - Projected cost per registration.
    - Gap to 500 target.
  - A `BarChart` (Recharts) comparing current vs projected registrations per channel.
  - Disclaimer: "Scenario projections are illustrative only. Actual results depend on many external factors."

  All calculations use `safeDivide`. No state is persisted.

  **Verify:** `npm run build` passes. Moving a slider updates the projected totals live.

---

- [ ] 24. **Final integration — wire up all imports, CSS modules, and missing styles**

  At this point all components exist. Do a final pass to:
  1. Ensure every component has its CSS (either inline styles via CSS variables or a co-located `.css` file). Write co-located CSS files for each module (e.g. `Dashboard.css`, `ChannelAnalytics.css`, etc.) rather than one monolithic CSS file — this makes it easier to debug.
  2. Verify that `Toast.jsx` is rendered in `Layout.jsx` and subscribes to the toast store correctly.
  3. Verify the "DEMO DATA — SIMULATED CAMPAIGN" badge is visible on the Header on every page.
  4. Check that the sidebar "Reset to Seed" action dispatches `RESET_TO_SEED` with a confirmation dialog.
  5. Ensure the `safeDivide` function is called everywhere a division appears.
  6. Verify the `EmptyState` component is used in: RegistrationTable (no registrations), AmbassadorManager (no ambassadors), ExperimentLab (no experiments), AIGrowthAdvisor (no recommendations).

  **Verify:** `npm run build` passes with zero errors. `npm run dev` opens in browser, all 7 nav items are clickable, all pages render without console errors.

---

- [ ] 25. **Final build verification and data integrity checks**

  Run the production build and confirm the data invariants in the browser console.

  **Commands:**
  ```
  cd c:\GrowthPilotAi && npm run build
  ```

  Open `dist/index.html` in the browser (via `npm run preview`):
  ```
  cd c:\GrowthPilotAi && npm run preview
  ```

  **Data integrity checks** (run in browser DevTools console):

  ```js
  // Paste these into the browser console after the app loads.
  // They access the seed data directly (before any localStorage edits).
  // If localStorage has stale data, run "Reset to Seed" first.

  // 1. Total registrations = 283
  const regs = JSON.parse(localStorage.getItem('growthpilot-state')).registrations;
  console.assert(regs.length === 283, 'FAIL: total regs', regs.length);

  // 2. Channel distribution
  console.assert(regs.filter(r => r.channelId === 'ch-001').length === 87,  'FAIL ch-001');
  console.assert(regs.filter(r => r.channelId === 'ch-002').length === 134, 'FAIL ch-002');
  console.assert(regs.filter(r => r.channelId === 'ch-003').length === 62,  'FAIL ch-003');

  // 3. Daily actuals sum = 283
  const plans = JSON.parse(localStorage.getItem('growthpilot-state')).dayPlans;
  const actualSum = plans.reduce((s, d) => s + d.actual, 0);
  console.assert(actualSum === 283, 'FAIL: daily actuals sum', actualSum);

  // 4. Daily targets sum = 500
  const targetSum = plans.reduce((s, d) => s + d.target, 0);
  console.assert(targetSum === 500, 'FAIL: daily targets sum', targetSum);

  // 5. Total spend = 1900
  const txns = JSON.parse(localStorage.getItem('growthpilot-state')).transactions;
  const spendSum = txns.reduce((s, t) => s + t.amount, 0);
  console.assert(spendSum === 1900, 'FAIL: spend sum', spendSum);

  console.log('All data integrity checks passed.');
  ```

  **Expected build output:** No errors. `dist/` folder created. `dist/index.html` present.
  **Expected preview:** App loads, sidebar shows 7 nav items, Dashboard shows 283 total registrations and 56.6% completion.

---

## Summary of Files

| Path | Purpose |
|------|---------|
| `index.html` | App entry HTML |
| `src/main.jsx` | React root + AppProvider |
| `src/App.jsx` | Page routing (useState) |
| `src/App.css` | App shell layout |
| `src/index.css` | Design tokens, reset, base |
| `src/data/seedData.js` | All seed/demo data |
| `src/data/calculations.js` | Pure calculation functions |
| `src/data/recommendations.js` | Rule-based recommendation engine |
| `src/data/csvExport.js` | CSV download utilities |
| `src/store/useAppStore.js` | Context + useReducer store |
| `src/components/ui/*.jsx` | Toast, Modal, Badge, Tooltip, KPICard, EmptyState, LoadingSpinner |
| `src/components/layout/*.jsx` | Sidebar, Header, Layout |
| `src/components/charts/*.jsx` | 4 Recharts chart components |
| `src/modules/dashboard/*.jsx` | Module A |
| `src/modules/channels/*.jsx` | Module B |
| `src/modules/ambassadors/*.jsx` | Module C |
| `src/modules/experiments/*.jsx` | Module D |
| `src/modules/advisor/*.jsx` | Module E |
| `src/modules/planner/*.jsx` | Module F |
| `src/modules/simulator/*.jsx` | Module G |

## Dependency Order (for implementation)

```
seedData.js
  → calculations.js
  → recommendations.js
  → csvExport.js
  → useAppStore.js (imports seedData)
    → index.css + App.css
    → main.jsx
    → UI primitives (Toast, Modal, Badge, Tooltip, KPICard, EmptyState, LoadingSpinner)
    → Chart components (RegistrationTrendChart, ChannelBreakdownChart, FunnelChart, ExperimentComparisonChart)
    → Layout (Sidebar, Header, Layout — imports Toast)
    → App.jsx (imports Layout + all modules)
    → Modules A–G (each imports store + calculations + UI primitives + charts)
```

## Common Gotchas

1. **PowerShell path quoting:** Always use double quotes around paths that might contain spaces.
2. **Vite scaffold in existing directory:** Must pass `y` to the "not empty" prompt, or pre-clear with `--force` flag if supported.
3. **Recharts `ResponsiveContainer`:** must have an explicit height set (number, not percentage) or it collapses to 0. Always wrap in a div with explicit height.
4. **`createPortal` for Modal:** import `createPortal` from `react-dom`, not `react`.
5. **localStorage quota:** 5MB limit. 283 synthetic records are well within limits (~50KB).
6. **Division by zero:** all divisions must use `safeDivide`. Particularly: CPR when regs=0, CTR when reach=0, conversion when clicks=0.
7. **Case-insensitive email dedup:** normalize to `.toLowerCase()` before comparison in both the store reducer and the form validation.
8. **Recharts and React 18:** recharts 2.x is fully compatible with React 18. No special config needed.
9. **CSS custom properties in JSX:** to use `var(--accent)` in inline styles write `style={{ color: 'var(--accent)' }}`.
10. **`window.confirm` in StrictMode:** works fine; it's a browser native, not a React side effect.
