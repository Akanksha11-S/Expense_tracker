import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthShell from '../components/AuthShell.jsx';
import Field from '../components/Field.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Enter your name (at least 2 characters).';
    if (!EMAIL_RE.test(form.email.trim())) next.email = 'Enter a valid email address.';
    if (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
      next.password = 'Use at least 8 characters, with a letter and a number.';
    }
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match.';
    setErrors(next);
    setFormError('');
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      await signup(form.name.trim(), form.email.trim(), form.password);
    } catch (err) {
      setErrors(err.errors || {});
      setFormError(err.message);
      setBusy(false);
    }
  }

  const cls = (k) => `input ${errors[k] ? 'input-error' : ''}`;

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start keeping track of where your money goes."
      footer={<>Already registered? <Link to="/login" className="font-medium text-brand hover:underline">Log in</Link></>}
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        {formError && <div role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">{formError}</div>}
        <Field label="Full name" error={errors.name}>
          <input autoComplete="name" className={cls('name')} value={form.name} onChange={set('name')} />
        </Field>
        <Field label="Email" error={errors.email}>
          <input type="email" autoComplete="email" className={cls('email')} value={form.email} onChange={set('email')} />
        </Field>
        <Field label="Password" error={errors.password} hint="At least 8 characters, with a letter and a number.">
          <input type="password" autoComplete="new-password" className={cls('password')} value={form.password} onChange={set('password')} />
        </Field>
        <Field label="Confirm password" error={errors.confirm}>
          <input type="password" autoComplete="new-password" className={cls('confirm')} value={form.confirm} onChange={set('confirm')} />
        </Field>
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
      </form>
    </AuthShell>
  );
}
