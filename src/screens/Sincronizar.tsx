import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCalendarSync } from '../hooks/useCalendarSync';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { NotificationPanel } from '../components/NotificationPanel';
import { useBirthdayNotifications } from '../hooks/useBirthdayNotifications';
import { formatBirthDateForDisplay } from '../utils/formatting';

export default function Sincronizar() {
  const { sync, syncing, lastResult, error } = useCalendarSync();
  const { contacts } = useApp();
  const { colors, isDark } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const { totalCount } = useBirthdayNotifications();

  const googleContacts = contacts.filter(c => c.fromGoogle === 1);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* App bar */}
      <View style={[styles.appBar, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]}>
        <View style={styles.appBarLeft}>
          <View style={[styles.logoBox, { backgroundColor: colors.primary }]}>
            <Ionicons name="gift-outline" size={15} color="#fff" />
          </View>
          <Text style={[styles.appBarTitle, { color: colors.primary }]}>AniverSmart</Text>
        </View>
        <TouchableOpacity hitSlop={8} onPress={() => setShowNotifications(true)}>
          <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
          {totalCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.todayBadge }]}>
              <Text style={styles.badgeText}>{totalCount > 9 ? '9+' : totalCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Page title */}
        <View style={styles.hero}>
          <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>Sincronizar</Text>
          <View style={styles.calRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.calLabel, { color: colors.textMuted }]}>Google Calendar</Text>
          </View>
        </View>

        {/* Sync card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.syncIconWrap, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="sync-outline" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.syncCardTitle, { color: colors.textPrimary }]}>
            Importar Aniversários
          </Text>
          <Text style={[styles.syncCardDesc, { color: colors.textSecondary }]}>
            Mantenha sua lista sempre atualizada conectando-se ao Google Calendar.
            Identificaremos automaticamente as datas importantes para você.
          </Text>

          <TouchableOpacity
            style={[styles.syncBtn, { backgroundColor: colors.primaryButton }, syncing && styles.syncBtnDisabled]}
            onPress={sync}
            disabled={syncing}
            activeOpacity={0.85}
          >
            {syncing ? (
              <>
                <ActivityIndicator color={colors.onPrimary} size="small" />
                <Text style={[styles.syncBtnText, { color: colors.onPrimary }]}>Sincronizando...</Text>
              </>
            ) : (
              <>
                <Ionicons name="logo-google" size={18} color={colors.onPrimary} />
                <Text style={[styles.syncBtnText, { color: colors.onPrimary }]}>Sincronizar Agora</Text>
              </>
            )}
          </TouchableOpacity>

          {error && (
            <View style={[styles.feedbackBox, { backgroundColor: colors.errorLight }]}>
              <Ionicons name="alert-circle-outline" size={18} color={colors.error} />
              <Text style={[styles.feedbackText, { color: colors.error }]}>{error}</Text>
            </View>
          )}

          {lastResult && (
            <View style={[styles.feedbackBox, { backgroundColor: colors.successLight }]}>
              <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
              <Text style={[styles.feedbackText, { color: colors.success }]}>
                Sincronização concluída: {lastResult.added} adicionado{lastResult.added !== 1 ? 's' : ''},
                {' '}{lastResult.skipped} ignorado{lastResult.skipped !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Recent activity */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Últimas Atividades</Text>
            <Ionicons name="time-outline" size={18} color={colors.textMuted} />
          </View>
          {googleContacts.length === 0 ? (
            <View style={styles.noActivity}>
              <Ionicons name="cloud-offline-outline" size={32} color={colors.textMuted} />
              <Text style={[styles.noActivityText, { color: colors.textMuted }]}>
                Nenhuma sincronização recente
              </Text>
            </View>
          ) : (
            googleContacts.slice(0, 5).map(c => (
              <View key={c.id} style={[styles.activityRow, { borderTopColor: colors.divider }]}>
                <View style={[styles.activityAvatar, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.activityAvatarText, { color: colors.primary }]}>
                    {c.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.activityInfo}>
                  <Text style={[styles.activityName, { color: colors.textPrimary }]}>{c.name}</Text>
                  <Text style={[styles.activityDate, { color: colors.textMuted }]}>
                    {formatBirthDateForDisplay(c.birthDate)}
                  </Text>
                </View>
                <Ionicons name="logo-google" size={14} color={colors.primary} />
              </View>
            ))
          )}
        </View>

        {/* Security card */}
        <View style={[styles.infoCard, { backgroundColor: isDark ? colors.surfaceLow : '#f0faf5', borderColor: colors.primary + '30' }]}>
          <View style={[styles.infoIconWrap, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.infoText}>
            <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>Segurança Total</Text>
            <Text style={[styles.infoDesc, { color: colors.textSecondary }]}>
              Seus dados são criptografados de ponta a ponta. Não armazenamos senhas e
              solicitamos apenas acesso de leitura ao calendário.
            </Text>
          </View>
        </View>

        {/* Info card */}
        <View style={[styles.infoCard, { backgroundColor: isDark ? colors.surfaceVariant : '#eff8ff', borderColor: '#3b82f640' }]}>
          <View style={[styles.infoIconWrap, { backgroundColor: '#dbeafe' }]}>
            <Ionicons name="information-circle-outline" size={20} color="#3b82f6" />
          </View>
          <View style={styles.infoText}>
            <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>Informação Importante</Text>
            <Text style={[styles.infoDesc, { color: colors.textSecondary }]}>
              A sincronização automática acontece a cada 24 horas para garantir que você
              nunca perca uma nova adição à sua agenda.
            </Text>
          </View>
        </View>
      </ScrollView>

      <NotificationPanel
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  appBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBox: {
    width: 28, height: 28, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
  },
  appBarTitle: { fontSize: 17, fontWeight: '700' },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  body: { padding: 16, gap: 14, paddingBottom: 40 },
  hero: { paddingTop: 8, paddingBottom: 4 },
  pageTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.4 },
  calRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  calLabel: { fontSize: 13 },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  syncIconWrap: {
    width: 64, height: 64, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
    alignSelf: 'center',
  },
  syncCardTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  syncCardDesc: { fontSize: 14, lineHeight: 21, textAlign: 'center' },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
  },
  syncBtnDisabled: { opacity: 0.7 },
  syncBtnText: { fontSize: 16, fontWeight: '700' },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  feedbackText: { flex: 1, fontSize: 14, lineHeight: 20 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  noActivity: { alignItems: 'center', gap: 8, paddingVertical: 16 },
  noActivityText: { fontSize: 14 },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  activityAvatar: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  activityAvatarText: { fontSize: 15, fontWeight: '700' },
  activityInfo: { flex: 1 },
  activityName: { fontSize: 15, fontWeight: '600' },
  activityDate: { fontSize: 12, marginTop: 1 },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  infoIconWrap: {
    width: 40, height: 40, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  infoText: { flex: 1, gap: 4 },
  infoTitle: { fontSize: 15, fontWeight: '700' },
  infoDesc: { fontSize: 13, lineHeight: 19 },
});
