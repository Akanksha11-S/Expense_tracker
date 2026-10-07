import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import Modal from '../components/Modal.jsx';
import ExpenseForm from '../components/ExpenseForm.jsx';
import ExpenseTable from '../components/ExpenseTable.jsx';
import CategoryChart from '../components/CategoryChart.jsx';
import { formatMoney } from '../utils/format.js';

function Stat({ label, value }) {
  return (
    <div className="px-5 py-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 truncate text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function ConfirmDelete({ expense, onConfirm, onCancel }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function go() {
    setBusy(true);
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <>
      <p className="text-sm text-muted">
        This will permanently remove the {expense.category.toLowerCase()} expense of{' '}
        <span className="font-medium text-ink">{formatMoney(expense.amount)}</span>. You can't undo this.
      </p>
      {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn-secondary" onClick={onCancel}>Keep expense</button>
        <button className="btn-danger" onClick={go} disabled={busy}>{busy ? 'Deleting…' : 'Delete expense'}</button>
      </div>
    </>
  );
}

export default function Dashboard() {
  const { call } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [modal, setModal] = useState(null); // { mode: 'add' | 'edit' | 'delete', expense? }
  const [toast, setToast] = useState('');

  useEffect(() => {
    let alive = true;
    call('/expenses')
      .then((d) => alive && setExpenses(d.expenses))
      .catch((e) => alive && setLoadError(e.message))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [call]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const stats = useMemo(() => {
    const now = new Date();
    const byCat = {};
    let total = 0;
    let month = 0;
    expenses.forEach((e) => {
      total += e.amount;
      byCat[e.category] = (byCat[e.category] || 0) + e.amount;
      const d = new Date(e.createdAt);
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) month += e.amount;
    });
    const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
    return { total, month, top: top ? top[0] : '—' };
  }, [expenses]);

  const close = () => setModal(null);

  async function save(data) {
    if (modal.mode === 'edit') {
      const { expense } = await call(`/expenses/${modal.expense._id}`, { method: 'PUT', body: data });
      setExpenses((list) => list.map((e) => (e._id === expense._id ? expense : e)));
      setToast('Expense updated');
    } else {
      const { expense } = await call('/expenses', { method: 'POST', body: data });
      setExpenses((list) => [expense, ...list]);
      setToast('Expense added');
    }
    close();
  }

  async function remove() {
    const id = modal.expense._id;
    await call(`/expenses/${id}`, { method: 'DELETE' });
    setExpenses((list) => list.filter((e) => e._id !== id));
    setToast('Expense deleted');
    close();
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Your expenses</h1>
          <button className="btn-primary" onClick={() => setModal({ mode: 'add' })}>Add expense</button>
        </div>

        {loadError && <div role="alert" className="rounded-md bg-danger-soft px-4 py-3 text-sm text-danger">{loadError}</div>}

        <section className="panel grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x [&>*:nth-child(-n+2)]:border-b [&>*:nth-child(-n+2)]:border-line sm:[&>*]:border-b-0">
          <Stat label="Total spent" value={formatMoney(stats.total)} />
          <Stat label="This month" value={formatMoney(stats.month)} />
          <Stat label="Entries" value={expenses.length} />
          <Stat label="Biggest category" value={stats.top} />
        </section>

        <section className="panel p-5">
          <h2 className="mb-4 font-semibold">Spending by category</h2>
          {loading ? <p className="py-10 text-center text-sm text-muted">Loading…</p> : <CategoryChart expenses={expenses} />}
        </section>

        <section className="panel overflow-hidden">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-semibold">All expenses</h2>
            <p className="text-sm text-muted">Newest first</p>
          </div>
          {loading ? (
            <p className="py-12 text-center text-sm text-muted">Loading…</p>
          ) : expenses.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-muted">You haven't added any expenses yet.</p>
              <button className="btn-primary mt-4" onClick={() => setModal({ mode: 'add' })}>Add your first expense</button>
            </div>
          ) : (
            <ExpenseTable
              expenses={expenses}
              onEdit={(expense) => setModal({ mode: 'edit', expense })}
              onDelete={(expense) => setModal({ mode: 'delete', expense })}
            />
          )}
        </section>
      </main>

      {modal && modal.mode !== 'delete' && (
        <Modal title={modal.mode === 'edit' ? 'Edit expense' : 'Add expense'} onClose={close}>
          <ExpenseForm expense={modal.expense} onSubmit={save} onCancel={close} />
        </Modal>
      )}
      {modal?.mode === 'delete' && (
        <Modal title="Delete this expense?" onClose={close}>
          <ConfirmDelete expense={modal.expense} onConfirm={remove} onCancel={close} />
        </Modal>
      )}

      {toast && (
        <div role="status" className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-md bg-ink px-4 py-2 text-sm text-white shadow-lg">{toast}</div>
      )}
    </div>
  );
}
