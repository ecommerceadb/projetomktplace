import { useState } from "react";
import { Calendar } from "lucide-react";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const now = new Date();
const CURRENT_MONTH = now.getMonth();
const CURRENT_YEAR = now.getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

export function PeriodFilter({
  className = "",
}: {
  className?: string;
}) {
  const [mes, setMes] = useState<number>(CURRENT_MONTH);
  const [ano, setAno] = useState<number>(CURRENT_YEAR);

  return (
    <label className={`inline-flex items-center gap-2 text-sm ${className}`}>
      <Calendar className="size-4 text-muted-foreground" />
      <span className="text-muted-foreground hidden sm:inline">Período:</span>
      <select
        value={mes}
        onChange={(e) => setMes(Number(e.target.value))}
        aria-label="Mês"
        className="rounded-md border border-border bg-card px-2 py-2 text-sm font-medium text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {MESES.map((m, i) => (
          <option key={m} value={i}>{m}</option>
        ))}
      </select>
      <select
        value={ano}
        onChange={(e) => setAno(Number(e.target.value))}
        aria-label="Ano"
        className="rounded-md border border-border bg-card px-2 py-2 text-sm font-medium text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {YEARS.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </label>
  );
}
