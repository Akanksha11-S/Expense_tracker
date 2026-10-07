import { useState } from 'react';
import Field from './Field.jsx';
import { CATEGORIES } from '../utils/categories.js';

export default function ExpenseForm({ expense, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    category: expense?.category || '',
    amount: expense ? String(expense.amount) : '',
    comments: expense?.comments || '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const cls = (k) => `input ${errors[k] ? 'input-error' : ''}`;

  async function submit(e) {
    e.preventDefault();
    const next = {};
    const amount = Number(form.amount);
    if (!form.category) next.category = 'Choose a category.';
    if (form.amount === '' || !Number.isFinite(amount) || amount <= 0) next.amount = 'Enter an amount greater than zero.';
    else if (amount > 100000000) next.amount = 'Amount is too large.';
    if (form.comments.length > 250) next.comments = 'Comments can be up to 250 characters.';
    setErrors(next);
    setFormError('');
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      await onSubmit({ category: form.category, amount, comments: form.comments.trim() });
    } catch (err) {
      setErrors(err.errors || {});
      setFormError(err.message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {formError && <div role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">{formError}</div>}
      <Field label="Category" error={errors.category}>
        <select className={cls('category')} value={form.category} onChange={set('category')}>
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Amount" error={errors.amount}>
        <input type="number" inputMode="decimal" step="0.01" min="0" placeholder="0.00" className={cls('amount')} value={form.amount} onChange={set('amount')} />
      </Field>
      <Field label="Comments (optional)" error={errors.comments} hint={`${form.comments.length}/250`}>
        <textarea rows={3} className={cls('comments')} value={form.comments} onChange={set('comments')} />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : expense ? 'Save changes' : 'Add expense'}</button>
      </div>
    </form>
  );
}
