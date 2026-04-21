import { RELATIONSHIP_TYPES } from './constants';

export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

export function isValidDate(dateStr: string): boolean {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;
  const [day, month, year] = dateStr.split('/').map(Number);
  if (year < 1900) return false;
  if (year > new Date().getFullYear()) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;
  const d = new Date(year, month - 1, day);
  // Verifica se o JS não "normalizou" a data (ex: 31/02 → 03/03)
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

// DDDs válidos conforme ANATEL
const VALID_DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, // SP
  21, 22, 24,                           // RJ
  27, 28,                               // ES
  31, 32, 33, 34, 35, 37, 38,           // MG
  41, 42, 43, 44, 45, 46,               // PR
  47, 48, 49,                           // SC
  51, 53, 54, 55,                       // RS
  61,                                   // DF
  62, 64,                               // GO
  63,                                   // TO
  65, 66,                               // MT
  67,                                   // MS
  68,                                   // AC
  69,                                   // RO
  71, 73, 74, 75, 77,                   // BA
  79,                                   // SE
  81, 87,                               // PE
  82,                                   // AL
  83,                                   // PB
  84,                                   // RN
  85, 88,                               // CE
  86, 89,                               // PI
  91, 93, 94,                           // PA
  92, 97,                               // AM
  95,                                   // RR
  96,                                   // AP
  98, 99,                               // MA
]);

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 10 && digits.length !== 11) return false;
  const ddd = Number(digits.slice(0, 2));
  if (!VALID_DDDS.has(ddd)) return false;
  const number = digits.slice(2);
  if (digits.length === 11) {
    // Celular: deve começar com 9
    return number[0] === '9';
  }
  // Fixo: deve começar com 2-8
  return number[0] >= '2' && number[0] <= '8';
}

const VALID_RELATIONSHIPS = new Set(RELATIONSHIP_TYPES.map(r => r.value));

export function isValidRelationship(rel: string): boolean {
  return VALID_RELATIONSHIPS.has(rel);
}

export interface ContactFormErrors {
  name?: string;
  birthDate?: string;
  relationship?: string;
  phone?: string;
}

export function validateContactForm(data: {
  name: string;
  birthDate: string;
  relationship: string;
  phone: string;
}): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!isValidName(data.name))
    errors.name = 'Nome deve ter pelo menos 2 caracteres';

  if (!data.birthDate)
    errors.birthDate = 'Informe a data de nascimento';
  else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data.birthDate))
    errors.birthDate = 'Use o formato DD/MM/AAAA';
  else {
    const year = Number(data.birthDate.split('/')[2]);
    if (year < 1900)
      errors.birthDate = 'Ano deve ser 1900 ou posterior';
    else if (year > new Date().getFullYear())
      errors.birthDate = 'Data de nascimento não pode ser no futuro';
    else if (!isValidDate(data.birthDate))
      errors.birthDate = 'Data inválida (verifique dia e mês)';
  }

  if (!isValidRelationship(data.relationship))
    errors.relationship = 'Selecione um tipo de relacionamento';

  if (!isValidPhone(data.phone))
    errors.phone = 'Número inválido. Ex: (63) 91234-5678 ou (63) 3456-7890';

  return errors;
}
