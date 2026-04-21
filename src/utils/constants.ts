export const RELATIONSHIP_TYPES = [
  // Cônjuge / Parceiro
  { value: 'esposo_a',        label: 'Esposo(a)' },
  { value: 'namorado_a',      label: 'Namorado(a)' },
  { value: 'noivo_a',         label: 'Noivo(a)' },
  // Pais
  { value: 'pai',             label: 'Pai' },
  { value: 'mae',             label: 'Mãe' },
  { value: 'padrasto_a',      label: 'Padrasto(a)' },
  // Filhos / Família direta
  { value: 'filho_a',         label: 'Filho(a)' },
  { value: 'irmao_a',         label: 'Irmão(ã)' },
  // Avós / Netos
  { value: 'avo_a',           label: 'Avô/Avó' },
  { value: 'neto_a',          label: 'Neto(a)' },
  // Tios / Sobrinhos / Primos
  { value: 'tio_a',           label: 'Tio(a)' },
  { value: 'sobrinho_a',      label: 'Sobrinho(a)' },
  { value: 'primo_a',         label: 'Primo(a)' },
  // Sogros / Cunhados
  { value: 'sogro_a',         label: 'Sogro(a)' },
  { value: 'cunhado_a',       label: 'Cunhado(a)' },
  // Amigos
  { value: 'melhor_amigo_a',  label: 'Melhor Amigo(a)' },
  { value: 'amigo_a',         label: 'Amigo(a)' },
  // Trabalho
  { value: 'colega',          label: 'Colega de Trabalho' },
  { value: 'chefe',           label: 'Chefe' },
  { value: 'funcionario',     label: 'Funcionário' },
  { value: 'socio',           label: 'Sócio' },
  { value: 'cliente',         label: 'Cliente' },
  // Outros
  { value: 'conhecido_a',     label: 'Conhecido(a)' },
  { value: 'vizinho_a',       label: 'Vizinho(a)' },
  { value: 'outros',          label: 'Outros' },
] as const;

export type RelationshipType = typeof RELATIONSHIP_TYPES[number]['value'];

export const RELATIONSHIP_LABELS: Record<string, string> = Object.fromEntries(
  RELATIONSHIP_TYPES.map(r => [r.value, r.label])
);

export const DB_NAME = 'aniversmart.db';

export const WHATSAPP_URL = 'https://wa.me/';

export const DAYS_SOON = 7;
