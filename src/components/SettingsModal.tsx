import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { ThemeMode } from '../context/ThemeContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: string }[] = [
  { mode: 'system', label: 'Sistema', icon: 'phone-portrait-outline' },
  { mode: 'light',  label: 'Claro',   icon: 'sunny-outline' },
  { mode: 'dark',   label: 'Escuro',  icon: 'moon-outline' },
];

export function SettingsModal({ visible, onClose }: Props) {
  const { colors, isDark, mode, setMode } = useTheme();

  const toggleDark = () => {
    if (mode === 'system') {
      setMode(isDark ? 'light' : 'dark');
    } else {
      setMode(isDark ? 'light' : 'dark');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.logoBox, { backgroundColor: colors.primary }]}>
              <Ionicons name="settings-outline" size={15} color="#fff" />
            </View>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Configurações</Text>
          </View>
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: colors.surfaceLow }]}
            onPress={onClose}
            hitSlop={8}
          >
            <Ionicons name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.body}>

          {/* Aparência section */}
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>APARÊNCIA</Text>

          {/* Quick toggle row */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.toggleRow}>
              <View style={[styles.toggleIcon, { backgroundColor: isDark ? '#1e2d48' : '#fef9c3' }]}>
                <Ionicons
                  name={isDark ? 'moon' : 'sunny'}
                  size={22}
                  color={isDark ? colors.primary : '#d97706'}
                />
              </View>
              <View style={styles.toggleText}>
                <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>
                  Tema {isDark ? 'Escuro' : 'Claro'}
                </Text>
                <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>
                  {isDark ? 'Interface com fundo escuro' : 'Interface com fundo claro'}
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleDark}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#ffffff"
                ios_backgroundColor={colors.border}
              />
            </View>
          </View>

          {/* Mode selector */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>Modo de tema</Text>
            <View style={[styles.segmented, { backgroundColor: colors.background, borderColor: colors.border }]}>
              {THEME_OPTIONS.map((opt, i) => {
                const active = mode === opt.mode;
                return (
                  <TouchableOpacity
                    key={opt.mode}
                    style={[
                      styles.segment,
                      active && { backgroundColor: colors.primaryButton },
                      i < THEME_OPTIONS.length - 1 && styles.segmentBorder,
                      !active && { borderRightColor: colors.border },
                    ]}
                    onPress={() => setMode(opt.mode)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={opt.icon as any}
                      size={16}
                      color={active ? '#ffffff' : colors.textSecondary}
                    />
                    <Text style={[
                      styles.segmentText,
                      { color: active ? '#ffffff' : colors.textSecondary },
                      active && styles.segmentTextActive,
                    ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={[styles.modeHint, { color: colors.textMuted }]}>
              {mode === 'system'
                ? 'Segue a preferência do seu dispositivo'
                : mode === 'dark'
                ? 'Sempre usa o tema escuro'
                : 'Sempre usa o tema claro'}
            </Text>
          </View>

          {/* Preview strip */}
          <View style={[styles.previewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>Pré-visualização</Text>
            <View style={styles.previewRow}>
              <View style={[styles.previewChip, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="gift-outline" size={14} color={colors.primary} />
                <Text style={[styles.previewChipText, { color: colors.primary }]}>AniverSmart</Text>
              </View>
              <View style={[styles.previewChip, { backgroundColor: isDark ? colors.surfaceVariant : '#f1f5f9' }]}>
                <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.previewChipText, { color: colors.textSecondary }]}>Contatos</Text>
              </View>
              <View style={[styles.previewBadge, { backgroundColor: colors.primaryButton }]}>
                <Text style={styles.previewBadgeText}>7 DIAS</Text>
              </View>
            </View>
            <View style={[styles.previewBar, { backgroundColor: colors.background }]}>
              <View style={[styles.previewBarFill, { backgroundColor: colors.primary, width: '65%' }]} />
            </View>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox: {
    width: 30, height: 30, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  body: { padding: 16, gap: 12 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1,
    paddingHorizontal: 2, marginTop: 8,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 0.8,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  toggleIcon: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  toggleText: { flex: 1 },
  toggleTitle: { fontSize: 16, fontWeight: '600' },
  toggleDesc:  { fontSize: 13, marginTop: 1 },
  segmented: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 12,
  },
  segmentBorder: { borderRightWidth: 1 },
  segmentText: { fontSize: 13, fontWeight: '600' },
  segmentTextActive: { fontWeight: '700' },
  modeHint: { fontSize: 12, textAlign: 'center' },
  previewCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  previewRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  previewChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  previewChipText: { fontSize: 13, fontWeight: '600' },
  previewBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    justifyContent: 'center',
  },
  previewBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  previewBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  previewBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
