export const StrategyTable = ({ strategies }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800/80">
    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800/70">
      <thead className="bg-slate-100/80 dark:bg-slate-900/80">
        <tr>
          {['Strategy', 'Type', 'Rationale', 'Reward / Risk', 'Win Prob.'].map((header) => (
            <th
              key={header}
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 bg-white/80 text-sm text-slate-700 dark:divide-slate-800/60 dark:bg-slate-950/40 dark:text-slate-200">
        {strategies.map((idea) => (
          <tr key={idea.name} className="hover:bg-slate-100 dark:hover:bg-slate-900/60">
            <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 dark:text-white">{idea.name}</td>
            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{idea.type}</td>
            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{idea.rationale}</td>
            <td className="px-4 py-3 font-mono text-electric">{idea.rewardRisk}</td>
            <td className="px-4 py-3 font-mono text-lime-500 dark:text-lime-300">{idea.probability}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
