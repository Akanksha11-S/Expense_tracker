import { CATEGORY_COLORS } from '../utils/categories.js';
import { formatDate, formatMoney } from '../utils/format.js';

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-line bg-gray-50 text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 text-right font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Created at</th>
            <th className="px-4 py-3 font-medium">Updated at</th>
            <th className="px-4 py-3 font-medium">Comments</th>
            <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {expenses.map((e) => (
            <tr key={e._id} className="hover:bg-gray-50/70">
              <td className="whitespace-nowrap px-4 py-3">
                <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-baseline" style={{ background: CATEGORY_COLORS[e.category] }} />
                {e.category}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums">{formatMoney(e.amount)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(e.createdAt)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(e.updatedAt)}</td>
              <td className="max-w-[220px] truncate px-4 py-3 text-muted" title={e.comments}>{e.comments || '—'}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <button onClick={() => onEdit(e)} className="rounded px-2 py-1 text-brand hover:bg-brand-soft">Edit</button>
                <button onClick={() => onDelete(e)} className="ml-1 rounded px-2 py-1 text-danger hover:bg-danger-soft">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
