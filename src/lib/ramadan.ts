export interface RamadanDay {
  day: number;
  gregorianISO: string;
  gregorianDisplay: string;
  hijriDisplay: string;
  fajr: string;
  maghrib: string;
}

const RAMADAN_CONFIG = {
  year: 2026,
  startDate: "2026-02-19", // Day 1
  totalDays: 30,

  location: {
    city: "Dhaka",
    country: "Bangladesh",
    method: 1,
    school: 1,
    latitudeAdjustmentMethod: 3,
    timezone: "Asia/Dhaka",
  },
};

function formatToApiDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; // Matches API format
}

export async function getRamadanCalendar(): Promise<RamadanDay[]> {
  const { year, startDate, totalDays, location } = RAMADAN_CONFIG;

  const start = new Date(startDate);

  const monthsNeeded = [2, 3];
  let allDays: any[] = [];

  for (const month of monthsNeeded) {
    const res = await fetch(
      `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${location.city}&country=${location.country}&method=${location.method}&school=${location.school}&latitudeAdjustmentMethod=${location.latitudeAdjustmentMethod}&timezonestring=${location.timezone}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      console.error("API error:", res.status);
      return [];
    }

    const data = await res.json();

    if (!data?.data) {
      console.error("Invalid API response");
      return [];
    }

    allDays = [...allDays, ...data.data];
  }

  const ramadanDays: RamadanDay[] = [];

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);

    const formattedDate = formatToApiDate(currentDate);

    const apiDay = allDays.find((d) => d.date.gregorian.date === formattedDate);

    if (!apiDay) {
      console.warn("Missing date:", formattedDate);
      continue;
    }

    ramadanDays.push({
      day: i + 1,
      gregorianISO: formattedDate,
      gregorianDisplay: `${apiDay.date.gregorian.day} ${apiDay.date.gregorian.month.en}`,
      hijriDisplay: `${apiDay.date.hijri.day} ${apiDay.date.hijri.month.en} ${apiDay.date.hijri.year} AH`,
      fajr: apiDay.timings.Fajr.split(" ")[0],
      maghrib: apiDay.timings.Maghrib.split(" ")[0],
    });
  }

  console.log("Ramadan days generated:", ramadanDays.length);

  return ramadanDays;
}
