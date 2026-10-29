// src/data/seedData.js
// All data is clearly labeled as SIMULATED DEMONSTRATION DATA.
// No Math.random() used — all values are deterministic.

export const campaignConfig = {
  id: 'campaign-001',
  name: 'Build Your First AI Project in 60 Minutes',
  target: 500,
  budget: 2000,
  startDate: '2024-01-15',
  endDate: '2024-01-21',
  status: 'active',
};

export const seedChannels = [
  { id: 'ch-001', name: 'WhatsApp & Telegram Communities', type: 'community', reach: 8500,  clicks: 612, registrations: 87,  spend: 0,    color: '#6366F1' },
  { id: 'ch-002', name: 'Student Ambassadors & Coding Clubs', type: 'ambassador', reach: 4200, clicks: 389, registrations: 134, spend: 800,  color: '#10B981' },
  { id: 'ch-003', name: 'LinkedIn & Targeted Outreach',       type: 'paid',      reach: 15000, clicks: 890, registrations: 62,  spend: 1100, color: '#F59E0B' },
];

export const seedTransactions = [
  { id: 'txn-001', channelId: 'ch-002', amount: 800,  description: 'Ambassador incentive budget', date: '2024-01-15' },
  { id: 'txn-002', channelId: 'ch-003', amount: 800,  description: 'LinkedIn sponsored posts',    date: '2024-01-15' },
  { id: 'txn-003', channelId: 'ch-003', amount: 300,  description: 'LinkedIn retargeting ads',    date: '2024-01-18' },
];
// Total spend: 1900; remaining: 100

export const seedAmbassadors = [
  { id: 'amb-001', name: 'Arjun Sharma',  college: 'IIT Hyderabad',      code: 'ARJUN2024', channelId: 'ch-002', registrations: 23, status: 'active',   joinDate: '2024-01-14' },
  { id: 'amb-002', name: 'Priya Nair',    college: 'NIT Warangal',       code: 'PRIYA2024', channelId: 'ch-002', registrations: 19, status: 'active',   joinDate: '2024-01-14' },
  { id: 'amb-003', name: 'Rahul Verma',   college: 'BITS Pilani',        code: 'RAHUL2024', channelId: 'ch-002', registrations: 31, status: 'active',   joinDate: '2024-01-14' },
  { id: 'amb-004', name: 'Sneha Reddy',   college: 'Osmania University', code: 'SNEHA2024', channelId: 'ch-002', registrations: 18, status: 'active',   joinDate: '2024-01-15' },
  { id: 'amb-005', name: 'Kiran Kumar',   college: 'JNTU Hyderabad',     code: 'KIRAN2024', channelId: 'ch-002', registrations: 27, status: 'active',   joinDate: '2024-01-15' },
  { id: 'amb-006', name: 'Divya Menon',   college: 'VIT Vellore',        code: 'DIVYA2024', channelId: 'ch-002', registrations: 16, status: 'active',   joinDate: '2024-01-15' },
  { id: 'amb-007', name: 'Aditya Singh',  college: 'SRM University',     code: 'ADITY2024', channelId: 'ch-002', registrations: 0,  status: 'inactive', joinDate: '2024-01-16' },
  { id: 'amb-008', name: 'Meera Pillai',  college: 'Amrita University',  code: 'MEERA2024', channelId: 'ch-001', registrations: 12, status: 'active',   joinDate: '2024-01-14' },
];

export const seedExperiments = [
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

export const seedDailyPlan = [
  { day: 1, date: '2024-01-15', target: 50, actual: 45, activity: 'Launch WhatsApp community blast',                    channelId: 'ch-001', status: 'completed' },
  { day: 2, date: '2024-01-16', target: 70, actual: 55, activity: 'Ambassador outreach begins \u2014 coding clubs',      channelId: 'ch-002', status: 'completed' },
  { day: 3, date: '2024-01-17', target: 80, actual: 63, activity: 'LinkedIn sponsored post + ambassador push',           channelId: 'ch-003', status: 'completed' },
  { day: 4, date: '2024-01-18', target: 80, actual: 58, activity: 'Mid-campaign ambassador check-in + Telegram groups',  channelId: 'ch-001', status: 'completed' },
  { day: 5, date: '2024-01-19', target: 75, actual: 62, activity: 'LinkedIn retargeting + new ambassador codes',         channelId: 'ch-003', status: 'completed' },
  { day: 6, date: '2024-01-20', target: 70, actual: 0,  activity: 'Final ambassador sprint \u2014 all channels',         channelId: 'ch-002', status: 'upcoming'  },
  { day: 7, date: '2024-01-21', target: 75, actual: 0,  activity: 'Last-day urgency blast \u2014 WhatsApp + LinkedIn',   channelId: 'ch-001', status: 'upcoming'  },
];
// targets sum: 50+70+80+80+75+70+75 = 500
// actuals sum: 45+55+63+58+62+0+0   = 283

// ── Synthetic registration records ────────────────────────────────────────────
// 283 records generated deterministically (no Math.random).
// Channel distribution: ch-001 [0–86] = 87, ch-002 [87–220] = 134, ch-003 [221–282] = 62
// Daily distribution: Jan15:45, Jan16:55, Jan17:63, Jan18:58, Jan19:62

const FIRST_NAMES = [
  'Aarav','Aditya','Akash','Amit','Ananya','Anjali','Arjun','Aryan',
  'Bhavya','Chetan','Deepak','Dhruv','Divya','Gaurav','Isha','Kabir',
  'Karan','Kavya','Kunal','Lakshmi','Manish','Meera','Mohit','Nandini',
  'Nikhil','Pankaj','Pooja','Priya','Rahul','Ravi','Ritika','Rohit',
  'Sachin','Sameer','Sandeep','Sanjay','Sara','Shivam','Shreya','Sneha',
];

const LAST_NAMES = [
  'Agarwal','Bhat','Choudhary','Das','Desai','Dubey','Gandhi','Garg',
  'Gupta','Iyer','Jain','Joshi','Kapoor','Kaur','Khan','Kumar',
  'Mehta','Mishra','Nair','Patel','Pillai','Rao','Reddy','Sharma',
  'Singh','Sinha','Tiwari','Verma','Yadav','Jha',
];

const COLLEGES = [
  'IIT Hyderabad','NIT Warangal','BITS Pilani','Osmania University',
  'JNTU Hyderabad','VIT Vellore','SRM University','Amrita University',
  'IIIT Hyderabad','Manipal Institute of Technology','PSG College of Technology',
  'Thapar University','RV College of Engineering','BMS College of Engineering',
  'College of Engineering Pune','NSIT Delhi','DTU Delhi','COEP Pune',
  'MIT Pune','KLE Tech',
];

const AMBASSADOR_CODES = [
  'ARJUN2024','PRIYA2024','RAHUL2024','SNEHA2024','KIRAN2024','DIVYA2024','MEERA2024',
];

// Date assignment: first 45 → Jan 15, next 55 → Jan 16, etc.
const DATE_RANGES = [
  { date: '2024-01-15', end: 45  },
  { date: '2024-01-16', end: 100 },
  { date: '2024-01-17', end: 163 },
  { date: '2024-01-18', end: 221 },
  { date: '2024-01-19', end: 283 },
];

function getDate(index) {
  for (const r of DATE_RANGES) {
    if (index < r.end) return r.date;
  }
  return '2024-01-19';
}

function getChannelId(index) {
  if (index < 87)  return 'ch-001';
  if (index < 221) return 'ch-002';
  return 'ch-003';
}

function getReferralCode(index, channelId) {
  if (channelId === 'ch-002') return AMBASSADOR_CODES[index % AMBASSADOR_CODES.length];
  return null;
}

export const seedRegistrations = Array.from({ length: 283 }, (_, i) => {
  const first    = FIRST_NAMES[i % FIRST_NAMES.length];
  const last     = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length];
  const college  = COLLEGES[i % COLLEGES.length];
  const channelId = getChannelId(i);
  const date     = getDate(i);
  const ambassadorCode = getReferralCode(i, channelId);

  return {
    id:             `reg-${String(i + 1).padStart(4, '0')}`,
    name:           `${first} ${last}`,
    email:          `${first.toLowerCase()}.${last.toLowerCase()}${i + 1}@demo.edu`,
    college,
    channelId,
    ambassadorCode,
    registrationDate: date,
    isSimulated:    true,
  };
});
