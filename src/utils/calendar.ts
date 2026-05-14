export type AttendanceDay = {
  date: string;
  trained: boolean;
};

export function toggleAttendance(days: AttendanceDay[], date: string): AttendanceDay[] {
  const existing = days.find((day) => day.date === date);

  if (!existing) {
    return [...days, { date, trained: true }];
  }

  return days.map((day) =>
    day.date === date ? { ...day, trained: !day.trained } : day
  );
}

export function calculateAttendancePercentage(days: AttendanceDay[], planned: number): number {
  const trained = days.filter((day) => day.trained).length;

  if (planned <= 0) return 0;

  return Math.min(100, Math.round((trained / planned) * 100));
}

export function getMonthDays(year: number, monthIndex: number): string[] {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();

  return Array.from({ length: lastDay }, (_, index) => {
    const day = String(index + 1).padStart(2, '0');
    const month = String(monthIndex + 1).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
}
