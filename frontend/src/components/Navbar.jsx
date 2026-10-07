import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-brand text-sm font-semibold text-white">P</span>
          <span className="font-semibold">Pocketbook</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted sm:inline">{user?.name}</span>
          <button onClick={logout} className="btn-secondary px-3 py-1.5">Log out</button>
        </div>
      </div>
    </header>
  );
}
