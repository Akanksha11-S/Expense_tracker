export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="mb-6 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-brand text-sm font-semibold text-white">P</span>
        <span className="text-lg font-semibold">Pocketbook</span>
      </div>
      <div className="panel w-full max-w-sm p-6 sm:p-8">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
      <p className="mt-5 text-sm text-muted">{footer}</p>
    </div>
  );
}
