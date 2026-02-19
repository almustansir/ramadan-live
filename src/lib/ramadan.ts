export interface RamadanDay {
  day: number;
  gregorianISO: string;
  gregorianDisplay: string;
  hijriDisplay: string;
  fajr: string;
  maghrib: string;
}

/**
 * Ramadan Configuration
 * You can later move this to database for admin control
 */
const RAMADAN_CONFIG = {
  year: 2026,
  startDate: "2026-02-19", // ✅ Day 1 fixed
  totalDays: 30,

  location: {
    city: "Dhaka",
    country: "Bangladesh",
    method: 1, // Karachi
    school: 1, // Hanafi
    latitudeAdjustmentMethod: 3,
    timezone: "Asia/Dhaka",
  },
};

export async function getRamadanCalendar(): Promise<RamadanDay[]> {
  const { year, startDate, totalDays, location } = RAMADAN_CONFIG;

  const start = new Date(startDate);

  // We only need Feb + March for 2026 Ramadan
  const monthsNeeded = [2, 3];

  let allDays: any[] = [];

  for (const month of monthsNeeded) {
    const res = await fetch(
      `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${location.city}&country=${location.country}&method=${location.method}&school=${location.school}&latitudeAdjustmentMethod=${location.latitudeAdjustmentMethod}&timezonestring=${location.timezone}`,
      {
        next: { revalidate: 86400 }, // Cache for 24 hours
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch prayer times");
    }

    const data = await res.json();
    allDays = [...allDays, ...data.data];
  }

  const ramadanDays: RamadanDay[] = [];

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);

    const iso = currentDate.toISOString().split("T")[0];

    const apiDay = allDays.find((d) => d.date.gregorian.date === iso);

    if (!apiDay) continue;

    ramadanDays.push({
      day: i + 1,
      gregorianISO: iso,
      gregorianDisplay: currentDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
      }),
      hijriDisplay: `${apiDay.date.hijri.day} ${apiDay.date.hijri.month.en} ${apiDay.date.hijri.year} AH`,
      fajr: apiDay.timings.Fajr.split(" ")[0],
      maghrib: apiDay.timings.Maghrib.split(" ")[0],
    });
  }

  return ramadanDays;
}
