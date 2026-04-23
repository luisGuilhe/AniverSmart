export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

export function formatDateFull(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function parseDateString(dateStr: string): Date | null {
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('/').map(Number);
    const d = new Date(year, month - 1, day);
    if (isNaN(d.getTime())) return null;
    return d;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return null;
    return d;
  }
  return null;
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysUntilBirthday(birthDateStr: string): number {
  const today = new Date();
  const parts = birthDateStr.split('-');
  const birthMonth = parseInt(parts[1], 10) - 1;
  const birthDay = parseInt(parts[2], 10);

  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Nascidos em 29/02: usa 28/02 em anos não-bissextos para não gerar data inválida
  const resolveDay = (year: number) =>
    birthMonth === 1 && birthDay === 29 && !isLeapYear(year) ? 28 : birthDay;

  const thisYear = new Date(today.getFullYear(), birthMonth, resolveDay(today.getFullYear()));
  const nextYear = new Date(today.getFullYear() + 1, birthMonth, resolveDay(today.getFullYear() + 1));

  const diff = thisYear.getTime() - todayMidnight.getTime();

  if (diff < 0) {
    return Math.ceil((nextYear.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24));
  }
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  // Usa sempre o split 5-4 para evitar que o formato troque durante a digitação
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function extractDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function maskPhone(phone: string): string {
  const d = extractDigits(phone);
  if (d.length >= 10) {
    return `${d.slice(0, 2)} 9xxxx-${d.slice(-4)}`;
  }
  return 'xx xxxx-xxxx';
}

export function formatBirthDateForDB(dateStr: string): string {
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  throw new Error(`Formato de data inválido: ${dateStr}`);
}

export function formatBirthDateForDisplay(dateStr: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }
  return dateStr;
}

export function getBirthdayLabel(daysLeft: number): string {
  if (daysLeft === 0) return 'Hoje!';
  if (daysLeft === 1) return 'Amanhã!';
  return `Em ${daysLeft} dias`;
}
