export function formatTo12Hour(time24: string): string {
  const [hour, minute] = time24.split(":").map(Number);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return time24;
  }

  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
}
