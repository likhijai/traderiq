import { useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, Area, Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { usePollingQuery } from '../hooks/usePollingQuery.js';
import { fetchFnOMetrics, fetchFlowBreakdown, fetchPerformanceSeries } from '../utils/mockApi.js';
import { DataCard } from '../components/DataCard.jsx';
import { StrategyTable } from '../components/StrategyTable.jsx';

const Section = ({ title, subtitle, children, description }) => (
  <section className="space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-electric/80">{subtitle}</p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
        {description && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>}
      </div>
    </header>
    {children}
  </section>
);

const FnO = () => {
  const { data: metrics } = usePollingQuery(['fno-metrics'], fetchFnOMetrics);
  const { data: flows } = usePollingQuery(['fno-flows'], fetchFlowBreakdown);
  const { data: performance } = usePollingQuery(['fno-performance'], fetchPerformanceSeries);

  const greekSeries = useMemo(
    () =>
      metrics?.optionGreeks?.map((row) => ({
        strike: row.strike,
        delta: row.delta,
        gamma: row.gamma,
        theta: row.theta,
        vega: row.vega,
      })) ?? [],
    [metrics]
  );

  return (
    <div className="space-y-16">
      <Section title="Derivatives Dashboard" subtitle="A. Key Greeks" description="Monitoring live option sensitivities across strikes.">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {greekSeries.slice(0, 4).map((greek) => (
            <DataCard
              key={greek.strike}
              title={`Strike ${greek.strike}`}
              subtitle="Delta"
              value={greek.delta}
              change={Number((greek.theta / 10).toFixed(2))}
              footer={`Vega ${greek.vega.toFixed(2)} • Gamma ${greek.gamma}`}
            >
              <p className="font-mono text-sm text-slate-200">Θ {greek.theta.toFixed(2)}</p>
            </DataCard>
          ))}
        </div>
      </Section>

      <Section title="Surface Watch" subtitle="B. Option Landscape" description="Combined delta/theta footprint to highlight risk clusters.">
        <div className="neon-card rounded-2xl p-6">
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={greekSeries}>
              <defs>
                <linearGradient id="deltaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ADEDE" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,0.2)" strokeDasharray="3 3" />
              <XAxis dataKey="strike" stroke="#94A3B8" tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#94A3B8" tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid rgba(30,41,59,0.8)' }} />
              <Area yAxisId="left" type="monotone" dataKey="delta" stroke="#4ADEDE" fill="url(#deltaGradient)" name="Delta" />
              <Bar yAxisId="right" dataKey="theta" fill="rgba(192,132,252,0.5)" radius={[8, 8, 0, 0]} name="Theta" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <Section title="OI Spurts" subtitle="C. Open Interest" description="Highlighting fresh positions building across sectors.">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {metrics?.oiSpurts?.map((item) => (
            <DataCard
              key={item.symbol}
              title={item.symbol}
              subtitle="OI Change %"
              value={`${item.change.toFixed(2)}%`}
              change={item.change}
              footer={`Volume multiple ${item.volume}x`}
            >
              <p className="text-sm text-slate-300">Momentum building in {item.symbol.split('-')[0]} complex.</p>
            </DataCard>
          ))}
        </div>
      </Section>

      <Section title="Spread Monitor" subtitle="D. Calendar & Vol" description="Track relative performance between near and far series.">
        <div className="neon-card rounded-2xl p-6">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={performance?.intraday ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="time" stroke="#94A3B8" tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid rgba(30,41,59,0.8)' }} />
              <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <Section title="Playbook" subtitle="E. Strategy Ideas" description="Quant-curated structures with favorable skew setups.">
        <StrategyTable strategies={metrics?.strategyIdeas ?? []} />
      </Section>

      <Section title="Flow Tape" subtitle="F. Participant Mix" description="Derivatives contribution to overall market flow.">
        <div className="neon-card rounded-2xl p-6">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={Object.entries(flows ?? {}).map(([label, value]) => ({ label, value }))}>
              <defs>
                <linearGradient id="fnoFlowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="label" stroke="#94A3B8" tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid rgba(30,41,59,0.8)' }} />
              <Bar dataKey="value" fill="url(#fnoFlowGradient)" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <Section title="Execution" subtitle="G. Liquidity Stack" description="Shortlist of optimal execution venues and spreads.">
        <div className="grid gap-6 md:grid-cols-3">
          {(metrics?.optionGreeks ?? []).slice(0, 3).map((item) => (
            <DataCard
              key={`liq-${item.strike}`}
              title={`Spread ${item.strike}`}
              subtitle="Bid / Ask"
              value={`${(item.delta * 20).toFixed(2)} / ${(item.delta * 20 + 0.8).toFixed(2)}`}
              footer={`Implied vol ${Math.abs(item.theta * 2).toFixed(2)}%`}
            >
              <p className="font-mono text-sm text-slate-200">Depth score {(item.vega / 2).toFixed(1)}</p>
            </DataCard>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default FnO;
