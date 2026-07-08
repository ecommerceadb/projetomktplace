import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const FALLBACK_YEAR = 2026;
const FALLBACK_MONTH = 0;

export function PeriodFilter({
  className = "",
}: {
  className?: string;
}) {
  const [mes, setMes] = useState<number>(FALLBACK_MONTH);
  const [ano, setAno] = useState<number>(FALLBACK_YEAR);

  useEffect(() => {
    const now = new Date();
    setMes(now.getMonth());
    setAno(now.getFullYear());
  }, []);

  const years = Array.from({ length: 6 }, (_, i) => ano - i).includes(FALLBACK_YEAR)
    ? Array.from({ length: 6 }, (_, i) => ano - i)
    : [ano, ...Array.from({ length: 5 }, (_, i) => ano - i - 1)];


  return (
    <label className={`inline-flex items-center gap-1.5 sm:gap-2 text-sm ${className}`}>
      <Calendar className="size-4 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground hidden sm:inline">Período:</span>
      <select
        value={mes}
        onChange={(e) => setMes(Number(e.target.value))}
        aria-label="Mês"
        className="rounded-md border border-border bg-card px-1.5 sm:px-2 py-1.5 sm:py-2 text-sm font-medium text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {MESES.map((m, i) => (
          <option key={m} value={i}>{m}</option>
        ))}
      </select>
      <select
        value={ano}
        onChange={(e) => setAno(Number(e.target.value))}
        aria-label="Ano"
        className="rounded-md border border-border bg-card px-1.5 sm:px-2 py-1.5 sm:py-2 text-sm font-medium text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {years.map((y: number) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </label>
  );
}
