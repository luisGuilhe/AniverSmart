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
  // Accepts DD/MM/YYYY or YYYY-MM-DD
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

export function daysUntilBirthday(birthDateStr: string): number {
  const today = new Date();
  const parts = birthDateStr.split('-');
  const birthMonth = parseInt(parts[1], 10) - 1;
  const birthDay = parseInt(parts[2], 10);

  const thisYear = new Date(today.getFullYear(), birthMonth, birthDay);
  const nextYear = new Date(today.getFullYear() + 1, birthMonth, birthDay);

  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = thisYear.getTime() - todayMidnight.getTime();

  if (diff < 0) {
    return Math.ceil((nextYear.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24));
  }
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2)  return `(${digits}`;
  if (digits.length <= 6)  return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length === 10) {
    // Fixo: (XX) XXXX-XXXX
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  // Celular: (XX) 9XXXX-XXXX
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
  // Convert DD/MM/YYYY to YYYY-MM-DD
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }
  return dateStr;
}

export function formatBirthDateForDisplay(dateStr: string): string {
  // Convert YYYY-MM-DD to DD/MM/YYYY
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
