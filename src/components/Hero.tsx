export default function Hero() {
  return (
    <section className="py-20 text-center">
      <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-800 mb-6">
        Ramadan 2026
      </h2>

      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Accurate Sehri & Iftar times. Clean design. Built for long-term Islamic
        utility.
      </p>

      <div className="mt-10 flex justify-center gap-4">
        <button className="px-6 py-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-lg">
          View Calendar
        </button>

        <button className="px-6 py-3 rounded-2xl border border-emerald-600 text-emerald-700 hover:bg-emerald-100 transition">
          Learn More
        </button>
      </div>
    </section>
  );
}
