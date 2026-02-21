"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Moon,
  Sun,
  Calendar as CalendarIcon,
  ChevronDown,
  Timer,
} from "lucide-react";

interface DayData {
  timings: { Fajr: string; Maghrib: string; [key: string]: string };
  date: {
    gregorian: { date: string; day: string; month: { en: string } };
    hijri: { day: string; month: { en: string; number: string }; year: string };
  };
}

const CONFIGS: Record<
  string,
  {
    city: string;
    country: string;
    method: number;
    theme: string;
    card: string;
    text: string;
    accent: string;
  }
> = {
  "Dhaka,BD": {
    city: "Dhaka",
    country: "BD",
    method: 1,
    theme: "from-emerald-900 via-emerald-800 to-teal-900",
    card: "bg-emerald-50/50",
    text: "text-emerald-900",
    accent: "text-amber-500",
  },
  "Texas,US": {
    city: "Houston",
    country: "US",
    method: 2,
    theme: "from-rose-900 via-red-800 to-orange-900",
    card: "bg-rose-50/50",
    text: "text-rose-900",
    accent: "text-orange-500",
  },
  "Newark,US": {
    city: "Newark",
    country: "US",
    method: 2,
    theme: "from-indigo-900 via-purple-800 to-fuchsia-900",
    card: "bg-purple-50/50",
    text: "text-indigo-900",
    accent: "text-pink-400",
  },
  "Melbourne,AU": {
    city: "Melbourne",
    country: "AU",
    method: 3,
    theme: "from-blue-900 via-sky-800 to-cyan-900",
    card: "bg-blue-50/50",
    text: "text-blue-900",
    accent: "text-sky-400",
  },
};

export default function RamadanLive() {
  const [location, setLocation] = useState("Dhaka,BD");
  const [data, setData] = useState<DayData[]>([]);
  const [today, setToday] = useState<DayData | null>(null);
  const [countdown, setCountdown] = useState("00:00:00");
  const [isFasting, setIsFasting] = useState(true);
  const [loading, setLoading] = useState(true);

  const config = CONFIGS[location];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [res1, res2] = await Promise.all([
        fetch(
          `https://api.aladhan.com/v1/calendarByCity/2026/2?city=${config.city}&country=${config.country}&method=${config.method}`,
        ),
        fetch(
          `https://api.aladhan.com/v1/calendarByCity/2026/3?city=${config.city}&country=${config.country}&method=${config.method}`,
        ),
      ]);

      const d1 = await res1.json();
      const d2 = await res2.json();

      const combined = [...(d1.data || []), ...(d2.data || [])];

      const ramadanDays = combined.filter(
        (day: DayData) => Number(day?.date?.hijri?.month?.number) === 9,
      );

      setData(ramadanDays);

      const now = new Date();
      const todayStr = `${String(now.getDate()).padStart(2, "0")}-${String(
        now.getMonth() + 1,
      ).padStart(2, "0")}-${now.getFullYear()}`;

      const currentDay =
        ramadanDays.find((d: DayData) => d.date.gregorian.date === todayStr) ||
        ramadanDays[0];

      setToday(currentDay || null);
    } catch (err) {
      console.error("Fetch failed:", err);
      setData([]);
      setToday(null);
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Countdown Logic
  useEffect(() => {
    if (!today || data.length === 0) return;

    const interval = setInterval(() => {
      const now = new Date();

      const parseTime = (timeStr: string) => {
        const [time] = timeStr.split(" ");
        const [hrs, mins] = time.split(":");
        const d = new Date();
        d.setHours(parseInt(hrs), parseInt(mins), 0, 0);
        return d;
      };

      const sehriTime = parseTime(today.timings.Fajr);
      const iftarTime = parseTime(today.timings.Maghrib);

      let target: Date;

      if (now < sehriTime) {
        target = sehriTime;
        setIsFasting(false);
      } else if (now < iftarTime) {
        target = iftarTime;
        setIsFasting(true);
      } else {
        const todayIndex = data.findIndex(
          (d) => d.date.gregorian.date === today.date.gregorian.date,
        );
        const nextDay = data[todayIndex + 1];
        target = nextDay ? parseTime(nextDay.timings.Fajr) : sehriTime;
        setIsFasting(false);
      }

      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("00:00:00");
        return;
      }

      const h = Math.floor(diff / 3600000)
        .toString()
        .padStart(2, "0");
      const m = Math.floor((diff % 3600000) / 60000)
        .toString()
        .padStart(2, "0");
      const s = Math.floor((diff % 60000) / 1000)
        .toString()
        .padStart(2, "0");

      setCountdown(`${h}:${m}:${s}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [today, data]);

  return (
    <div className="min-h-screen bg-slate-50 transition-all duration-700 pb-12">
      {/* HEADER */}
      <div
        className={`bg-gradient-to-br ${config.theme} pt-16 pb-32 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden`}
      >
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded blur-3xl animate-pulse" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-white/10 p-4 rounded backdrop-blur-md mb-4 border border-white/20">
            <Moon
              className="text-yellow-400 w-10 h-10 animate-bounce"
              style={{ animationDuration: "3s" }}
            />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">
            Ramadan 2026
          </h1>
          {today && (
            <div className="bg-black/20 backdrop-blur-lg px-4 py-1 rounded border border-white/10">
              <p className="text-white/90 font-bold text-sm uppercase tracking-widest">
                {today.date.hijri.day} {today.date.hijri.month.en}{" "}
                {today.date.hijri.year} AH
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-xl mx-auto px-5 -mt-20 relative z-20">
        {loading ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-12 shadow-xl text-center border border-white">
            <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded mx-auto mb-4" />
            <p className="font-bold text-slate-400 animate-pulse">
              Syncing with Stars...
            </p>
          </div>
        ) : (
          <>
            {/* COUNTDOWN CARD */}
            <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-xl border border-white text-center mb-8 relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${config.theme}`}
              />

              <div className="flex justify-center items-center gap-2 mb-6">
                <Timer size={18} className="text-slate-300" />
                <span className="text-slate-400 uppercase tracking-[0.2em] text-[10px] font-black">
                  {isFasting ? "Iftar Countdown" : "Sehri Countdown"}
                </span>
              </div>

              <div
                className={`text-7xl font-black mb-6 tracking-tighter tabular-nums ${config.text}`}
              >
                {countdown}
              </div>

              <div
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider ${
                  isFasting
                    ? "bg-emerald-500 text-white"
                    : "bg-amber-500 text-white"
                }`}
              >
                {isFasting ? <Sun size={18} /> : <Moon size={18} />}
                {isFasting ? "Fasting Active" : "Non-Fasting"}
              </div>
            </div>

            {/* LOCATION SELECTOR */}
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <MapPin className={`${config.accent}`} size={20} />
              </div>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white/80 backdrop-blur-md rounded-3xl py-6 pl-14 pr-12 shadow-lg font-black text-slate-700 appearance-none border border-transparent focus:ring-4 focus:ring-white/50 transition-all cursor-pointer"
              >
                {Object.keys(CONFIGS).map((key) => (
                  <option key={key} value={key}>
                    {key.replace(",", ", ")}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
                size={20}
              />
            </div>

            {/* CALENDAR */}
            <div className="bg-white rounded-[2.5rem] p-2 shadow-xl border border-slate-100 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-50">
                <CalendarIcon size={20} className="text-slate-300" />
                <span className="font-black text-slate-800 text-lg">
                  Full Schedule
                </span>
              </div>

              <div className="max-h-[500px] overflow-y-auto px-2 pb-4">
                {data.map((day, idx) => {
                  const isToday =
                    today?.date.gregorian.date === day.date.gregorian.date;

                  return (
                    <div
                      key={idx}
                      className={`flex justify-between items-center p-5 rounded-[1.8rem] transition-all mb-1 ${
                        isToday
                          ? `${config.card} border-2 border-white shadow-inner`
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                            isToday
                              ? "bg-white text-emerald-600"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-black text-slate-800 text-sm">
                            {day.date.gregorian.day}{" "}
                            {day.date.gregorian.month.en.slice(0, 3)}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">
                            Day {idx + 1}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-6 text-right">
                        <div>
                          <span className="text-[9px] font-black text-slate-300 uppercase">
                            Sehri
                          </span>
                          <span className="block font-mono font-bold text-slate-700">
                            {day.timings.Fajr.split(" ")[0]}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-slate-300 uppercase">
                            Iftar
                          </span>
                          <span
                            className={`block font-mono font-bold ${config.accent}`}
                          >
                            {day.timings.Maghrib.split(" ")[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
