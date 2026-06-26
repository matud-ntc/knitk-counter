/** Fecha relativa corta en español: "hoy", "ayer", "3 d", "2 sem", "12 may". */
export function relativeDate(input: Date | string | number): string {
  const date = new Date(input);
  const now = new Date();
  const ms = now.getTime() - date.getTime();
  const day = 86_400_000;
  const days = Math.floor(ms / day);

  if (days <= 0) return "hoy";
  if (days === 1) return "ayer";
  if (days < 7) return `${days} d`;
  if (days < 30) return `${Math.floor(days / 7)} sem`;

  return date.toLocaleDateString("es", { day: "numeric", month: "short" });
}
