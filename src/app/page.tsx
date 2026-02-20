import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import { getRamadanCalendar } from "@/lib/ramadan";

export default async function Home() {
  const ramadan = await getRamadanCalendar();

  const todayISO = new Date().toISOString().split("T")[0];
  const todayData = ramadan.find((d) => d.gregorianISO === todayISO);

  return (
    <>
      <Navbar />
      <Container>
        <section className="py-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-emerald-800">
            Ramadan 2026
          </h2>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            Day 1 starts February 19, 2026
          </p>
        </section>

        {ramadan.length === 0 && (
          <div className="text-center py-10 text-red-500">
            Failed to load Ramadan data.
          </div>
        )}

        {todayData && (
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-10 text-center border border-emerald-100">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Today
            </p>

            <h3 className="text-lg font-semibold mt-1">
              {todayData.hijriDisplay}
            </h3>

            <div className="flex justify-between items-center mt-6">
              <div className="flex-1">
                <p className="text-xs text-gray-500">Sehri Ends</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {todayData.fajr}
                </p>
              </div>

              <div className="w-px bg-gray-200 h-12" />

              <div className="flex-1">
                <p className="text-xs text-gray-500">Iftar Starts</p>
                <p className="text-2xl font-bold text-orange-600">
                  {todayData.maghrib}
                </p>
              </div>
            </div>
          </div>
        )}

        {ramadan.length > 0 && (
          <div className="bg-white rounded-3xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-center text-sm sm:text-base">
                <thead className="bg-emerald-100 text-emerald-900">
                  <tr>
                    <th className="p-3">Day</th>
                    <th>Date</th>
                    <th>Sehri</th>
                    <th>Iftar</th>
                  </tr>
                </thead>

                <tbody>
                  {ramadan.map((day) => (
                    <tr
                      key={day.day}
                      className={`border-t transition ${
                        day.gregorianISO === todayISO
                          ? "bg-yellow-50 font-semibold"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="p-3">{day.day}</td>
                      <td>{day.gregorianDisplay}</td>
                      <td>{day.fajr}</td>
                      <td className="text-emerald-700 font-semibold">
                        {day.maghrib}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="h-12" />
      </Container>
    </>
  );
}
