import { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { CATEGORY_COLORS } from '../utils/categories.js';
import { formatMoney } from '../utils/format.js';

ChartJS.register(ArcElement, Tooltip);

export default function CategoryChart({ expenses }) {
  const rows = useMemo(() => {
    const totals = {};
    expenses.forEach((e) => { totals[e.category] = (totals[e.category] || 0) + e.amount; });
    const sum = Object.values(totals).reduce((a, b) => a + b, 0);
    return Object.entries(totals)
      .map(([category, total]) => ({ category, total, share: sum ? (total / sum) * 100 : 0 }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  if (!rows.length) {
    return <p className="py-10 text-center text-sm text-muted">Add an expense to see how your spending is split by category.</p>;
  }

  const data = {
    labels: rows.map((r) => r.category),
    datasets: [{
      data: rows.map((r) => r.total),
      backgroundColor: rows.map((r) => CATEGORY_COLORS[r.category]),
      borderColor: '#fff',
      borderWidth: 2,
    }],
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${formatMoney(ctx.parsed)} (${rows[ctx.dataIndex].share.toFixed(1)}%)`,
        },
      },
    },
  };

  return (
    <div className="grid items-center gap-6 sm:grid-cols-2">
      <div className="mx-auto w-full max-w-[260px]">
        <Pie data={data} options={options} />
      </div>
      <ul className="space-y-2.5 text-sm">
        {rows.map((r) => (
          <li key={r.category} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORY_COLORS[r.category] }} />
              {r.category}
            </span>
            <span className="tabular-nums text-muted">
              {formatMoney(r.total)} <span className="ml-1 inline-block w-12 text-right">{r.share.toFixed(1)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
