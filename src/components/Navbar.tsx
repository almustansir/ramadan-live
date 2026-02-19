export default function Navbar() {
  return (
    <nav className="w-full py-4 border-b bg-white/70 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-emerald-700">🌙 Ramadan Live</h1>
        <button className="text-sm px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition">
          Coming Soon
        </button>
      </div>
    </nav>
  );
}
