const randomInRange = (min, max, digits = 2) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(digits));

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const sectors = ['IT', 'Banking', 'Energy', 'Auto', 'Pharma', 'FMCG'];
const sentiment = ['Bullish', 'Bearish', 'Neutral'];

export const fetchDashboardSnapshot = async () => ({
  indices: [
    { name: 'NIFTY 50', value: randomInRange(21000, 22500), change: randomInRange(-2.2, 2.2) },
    { name: 'BANK NIFTY', value: randomInRange(43000, 46500), change: randomInRange(-3, 3) },
    { name: 'FIN NIFTY', value: randomInRange(21000, 23000), change: randomInRange(-2.2, 2.2) },
  ],
  marketBreadth: {
    advances: Math.floor(Math.random() * 1000),
    declines: Math.floor(Math.random() * 1000),
    unchanged: Math.floor(Math.random() * 500),
  },
  trendingSectors: sectors.map((sector) => ({
    sector,
    momentum: randomInRange(-3, 4),
    volume: randomInRange(120, 300, 1),
  })),
  sentiment: sample(sentiment),
});

export const fetchFnOMetrics = async () => ({
  optionGreeks: Array.from({ length: 5 }).map((_, idx) => ({
    strike: 21000 + idx * 100,
    delta: randomInRange(-1, 1),
    gamma: randomInRange(0, 0.2, 3),
    theta: randomInRange(-15, 5),
    vega: randomInRange(0, 15),
  })),
  oiSpurts: sectors.map((sector) => ({
    symbol: `${sector.toUpperCase()}-${Math.floor(Math.random() * 100)}`,
    change: randomInRange(-12, 12),
    volume: randomInRange(1, 10, 2),
  })),
  strategyIdeas: Array.from({ length: 4 }).map((_, idx) => ({
    name: `Strategy ${idx + 1}`,
    type: sample(['Bull Call Spread', 'Iron Condor', 'Short Straddle', 'Protective Put']),
    rationale: sample([
      'Expecting consolidation with volatility crush.',
      'Momentum driven breakout opportunity.',
      'Range bound with high IV percentile.',
    ]),
    rewardRisk: randomInRange(1, 3, 2),
    probability: randomInRange(45, 75, 0),
  })),
});

export const fetchHeatmap = async () =>
  Array.from({ length: 15 }).map(() => ({
    symbol: sample(['INFY', 'TCS', 'HDFCBANK', 'RELIANCE', 'ITC', 'HUL', 'LT']),
    change: randomInRange(-4, 4),
  }));

export const fetchNews = async () =>
  Array.from({ length: 5 }).map((_, idx) => ({
    id: idx + 1,
    headline: sample([
      'RBI maintains policy stance amid inflation comfort.',
      'US markets rally as tech stocks gain.',
      'Crude prices soften on demand concerns.',
      'Banking sector leads gains on strong earnings.',
    ]),
    summary:
      'Markets remain volatile with traders tracking global cues and domestic macroeconomic indicators closely.',
    link: '#',
    timestamp: new Date().toISOString(),
  }));

export const fetchRadarMetrics = async () => ({
  liquidity: randomInRange(55, 95),
  volatility: randomInRange(15, 45),
  sentiment: randomInRange(40, 80),
  breadth: randomInRange(35, 70),
});

export const fetchFlowBreakdown = async () => ({
  fii: randomInRange(-500, 1500),
  dii: randomInRange(-300, 1000),
  options: randomInRange(1000, 4500),
  futures: randomInRange(-1200, 2200),
});

export const fetchPerformanceSeries = async () => ({
  intraday: Array.from({ length: 8 }).map((_, idx) => ({
    time: `${9 + idx}:00`,
    value: randomInRange(-1.5, 1.5),
  })),
  volume: Array.from({ length: 8 }).map((_, idx) => ({
    time: `${9 + idx}:00`,
    value: randomInRange(100, 350),
  })),
});
