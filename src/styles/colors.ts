export const LightColors = {
  // Brand
  primary: '#006948',
  primaryLight: '#e8f5ee',
  primaryButton: '#006948',
  onPrimary: '#ffffff',

  // Surfaces
  background: '#f0f4f8',
  surface: '#ffffff',
  surfaceLow: '#f4f7ff',
  surfaceVariant: '#e5eeff',

  // Text
  textPrimary: '#0b1c30',
  textSecondary: '#4a5568',
  textMuted: '#9ca3af',
  textWhite: '#ffffff',

  // Borders
  border: '#e2e8f0',
  divider: '#e2e8f0',

  // Feedback
  error: '#dc2626',
  errorLight: '#fee2e2',
  success: '#059669',
  successLight: '#d1fae5',
  warning: '#d97706',
  warningLight: '#fef3c7',

  // Tab bar
  tabBarBg: '#ffffff',
  tabBarBorder: '#f1f5f9',
  tabActive: '#006948',
  tabActiveBg: '#e8f5ee',
  tabInactive: '#9ca3af',

  // Badge timing
  todayBadge: '#e11d48',
  soonBadge: '#d97706',
  futureBadge: '#006948',

  // Backward compatibility aliases
  backgroundPrimary: '#ffffff',
  backgroundSecondary: '#f0f4f8',
  backgroundCard: '#ffffff',
  secondary: '#e11d48',
  weekBadge: '#d97706',

  relationshipColors: {
    // Cônjuge / Parceiro
    esposo_a: '#7c3aed', namorado_a: '#7c3aed', noivo_a: '#7c3aed',
    // Pais
    pai: '#2563eb', mae: '#e11d48', padrasto_a: '#2563eb',
    // Filhos / Família direta
    filho_a: '#0891b2', irmao_a: '#0284c7',
    // Avós / Netos
    avo_a: '#9C7BB5', neto_a: '#9C7BB5',
    // Tios / Sobrinhos / Primos
    tio_a: '#0369a1', sobrinho_a: '#0369a1', primo_a: '#0891b2',
    // Sogros / Cunhados
    sogro_a: '#4338ca', cunhado_a: '#4338ca',
    // Amigos
    melhor_amigo_a: '#059669', amigo_a: '#059669',
    // Trabalho
    colega: '#d97706', chefe: '#b45309',
    funcionario: '#ca8a04', socio: '#a16207', cliente: '#92400e',
    // Outros
    conhecido_a: '#6b7280', vizinho_a: '#6b7280', outros: '#6b7280',
  } as Record<string, string>,
};

export const DarkColors = {
  // Brand
  primary: '#4ade80',
  primaryLight: '#1a3d2b',
  primaryButton: '#22c55e',
  onPrimary: '#052e16',

  // Surfaces
  background: '#0d1b2a',
  surface: '#162032',
  surfaceLow: '#1e2d48',
  surfaceVariant: '#243550',

  // Text
  textPrimary: '#eaf1ff',
  textSecondary: '#94b0c8',
  textMuted: '#647d90',
  textWhite: '#ffffff',

  // Borders
  border: '#2d3f50',
  divider: '#1e2d40',

  // Feedback
  error: '#f87171',
  errorLight: '#450a0a',
  success: '#4ade80',
  successLight: '#052e16',
  warning: '#fbbf24',
  warningLight: '#451a03',

  // Tab bar
  tabBarBg: '#0d1b2a',
  tabBarBorder: '#1e2d40',
  tabActive: '#4ade80',
  tabActiveBg: '#1a3d2b',
  tabInactive: '#647d90',

  // Badge timing
  todayBadge: '#f43f5e',
  soonBadge: '#fbbf24',
  futureBadge: '#4ade80',

  // Backward compatibility aliases
  backgroundPrimary: '#162032',
  backgroundSecondary: '#0d1b2a',
  backgroundCard: '#162032',
  secondary: '#f43f5e',
  weekBadge: '#fbbf24',

  relationshipColors: {
    // Cônjuge / Parceiro
    esposo_a: '#a78bfa', namorado_a: '#a78bfa', noivo_a: '#a78bfa',
    // Pais
    pai: '#60a5fa', mae: '#f472b6', padrasto_a: '#60a5fa',
    // Filhos / Família direta
    filho_a: '#22d3ee', irmao_a: '#38bdf8',
    // Avós / Netos
    avo_a: '#c084fc', neto_a: '#c084fc',
    // Tios / Sobrinhos / Primos
    tio_a: '#38bdf8', sobrinho_a: '#38bdf8', primo_a: '#22d3ee',
    // Sogros / Cunhados
    sogro_a: '#818cf8', cunhado_a: '#818cf8',
    // Amigos
    melhor_amigo_a: '#4ade80', amigo_a: '#4ade80',
    // Trabalho
    colega: '#fbbf24', chefe: '#f59e0b',
    funcionario: '#fbbf24', socio: '#f59e0b', cliente: '#d97706',
    // Outros
    conhecido_a: '#94a3b8', vizinho_a: '#94a3b8', outros: '#94a3b8',
  } as Record<string, string>,
};

export type ThemeColors = typeof LightColors;

// Legacy export — unchanged components still work
export const Colors = LightColors;
