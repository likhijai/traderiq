import { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, Legend } from 'recharts';
import { usePollingQuery } from '../hooks/usePollingQuery.js';
import {
  fetchDashboardSnapshot,
  fetchPerformanceSeries,
  fetchHeatmap,
  fetchNews,
  fetchRadarMetrics,
  fetchFlowBreakdown,
} from '../utils/mockApi.js';
import { DataCard } from '../components/DataCard.jsx';
import { Gauge } from '../components/Gauge.jsx';
import { Heatmap } from '../components/Heatmap.jsx';
import { NewsModal } from '../components/NewsModal.jsx';

const Section = ({ title, subtitle, children }) => (
  <section className="space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-electric/80">{subtitle}</p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
      </div>
    </header>
    {children}
  </section>
);

const Home = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const { data: dashboard } = usePollingQuery(['dashboard'], fetchDashboardSnapshot);
  const { data: performance } = usePollingQuery(['performance'], fetchPerformanceSeries);
  const { data: heatmap } = usePollingQuery(['heatmap'], fetchHeatmap);
  const { data: news } = usePollingQuery(['news'], fetchNews);
  const { data: radar } = usePollingQuery(['radar'], fetchRadarMetrics);
  const { data: flow } = usePollingQuery(['flow'], fetchFlowBreakdown);

  return (
    <div className="space-y-16">
      <Section title="Market Pulse" subtitle="A. Overview & Breadth">
        <div className="grid gap-6 lg:grid-cols-5">
          {dashboard?.indices?.map((index) => (
            <DataCard
              key={index.name}
              title={index.name}
              subtitle="Index Level"
              value={index.value}
              change={index.change}
              className="lg:col-span-1"
            >
              <p className="text-xs text-slate-400">Live update from spot prices</p>
            </DataCard>
          ))}
          <div className="neon-card col-span-full grid gap-6 rounded-2xl p-6 md:grid-cols-2 lg:col-span-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Market Breadth</h3>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                {['advances', 'declines', 'unchanged'].map((key) => (
                  <div
                    key={key}
                    className="rounded-xl border border-slate-200/70 bg-white/70 p-3 text-slate-700 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-slate-200"
                  >
                    <p className="uppercase text-xs tracking-wide text-slate-500 dark:text-slate-400">{key}</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{dashboard?.marketBreadth?.[key]}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Sentiment leaning {dashboard?.sentiment?.toLowerCase()} with participation across core sectors.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Gauge
                label="Sentiment"
                value={
                  dashboard?.sentiment === 'Bullish'
                    ? 78
                    : dashboard?.sentiment === 'Bearish'
                      ? 32
                      : 52
                }
              />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Momentum & Sectors" subtitle="B. Sector Rotation">
        <div className="neon-card rounded-2xl p-6">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={dashboard?.trendingSectors ?? []}>
              <defs>
                <linearGradient id="momentumGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ADEDE" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="sector" stroke="#94A3B8" tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#94A3B8" tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" tickFormatter={(value) => `${value}M`} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid rgba(30,41,59,0.8)' }} />
              <Legend wrapperStyle={{ color: '#94A3B8' }} />
              <Bar yAxisId="left" dataKey="momentum" fill="url(#momentumGradient)" radius={[12, 12, 0, 0]} name="Momentum %" />
              <Bar yAxisId="right" dataKey="volume" fill="rgba(192,132,252,0.6)" radius={[12, 12, 0, 0]} name="Volume (M)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <Section title="Performance" subtitle="C. Intraday & Volume">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="neon-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Intraday Moves</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={performance?.intraday ?? []}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ADEDE" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#4ADEDE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="time" stroke="#94A3B8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid rgba(30,41,59,0.8)' }} />
                <Area type="monotone" dataKey="value" stroke="#4ADEDE" fillOpacity={1} fill="url(#areaGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="neon-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Volume Profile</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={performance?.volume ?? []}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C084FC" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#C084FC" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="time" stroke="#94A3B8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid rgba(30,41,59,0.8)' }} />
                <Area type="monotone" dataKey="value" stroke="#C084FC" fillOpacity={1} fill="url(#volumeGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Section>

      <Section title="Market Internals" subtitle="D. Liquidity Radar">
        <div className="neon-card rounded-2xl p-6">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart outerRadius={90} data={Object.entries(radar ?? {}).map(([key, value]) => ({ metric: key, score: value }))}>
                  <PolarGrid stroke="rgba(148,163,184,0.3)" />
                  <PolarAngleAxis dataKey="metric" stroke="#94A3B8" tick={{ fill: '#cbd5f5', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fill: '#94A3B8' }} />
                  <Radar dataKey="score" stroke="#22D3EE" fill="#22D3EE" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <p className="font-medium text-slate-900 dark:text-white">Liquidity vs Volatility</p>
              <p>
                Liquidity pockets remain supportive while volatility stays contained. Breadth metrics confirm stable participation
                with improving sentiment.
              </p>
              <ul className="grid grid-cols-2 gap-3">
                {Object.entries(radar ?? {}).map(([key, value]) => (
                  <li
                    key={key}
                    className="rounded-xl border border-slate-200/70 bg-white/70 p-3 text-slate-700 dark:border-slate-800/60 dark:bg-slate-900/50 dark:text-slate-200"
                  >
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{key}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Heatmap" subtitle="E. Sector Heat">
        <div className="neon-card rounded-2xl p-6">
          <Heatmap data={heatmap ?? []} />
        </div>
      </Section>

      <Section title="Newsflow" subtitle="F. Narrative Stream">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {news?.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() => setSelectedArticle(article)}
              className="neon-card flex h-full flex-col rounded-2xl p-5 text-left transition hover:-translate-y-1"
            >
              <span className="text-xs uppercase tracking-wide text-electric/70">Breaking</span>
              <span className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{article.headline}</span>
              <span className="mt-4 text-sm text-slate-600 dark:text-slate-300">{article.summary}</span>
              <time className="mt-6 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {new Date(article.timestamp).toLocaleTimeString()}
              </time>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Flows" subtitle="G. Participation Breakdown">
        <div className="neon-card rounded-2xl p-6">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={Object.entries(flow ?? {}).map(([label, value]) => ({ label, value }))}>
              <defs>
                <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="label" stroke="#94A3B8" tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid rgba(30,41,59,0.8)' }} />
              <Bar dataKey="value" fill="url(#flowGradient)" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <NewsModal open={Boolean(selectedArticle)} onClose={() => setSelectedArticle(null)} article={selectedArticle} />
    </div>
  );
};

export default Home;
