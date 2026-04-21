import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useApp } from '../context/AppContext';
import { exportDatabase } from '../services/database';
import { useTheme } from '../hooks/useTheme';
import { SettingsModal } from '../components/SettingsModal';

const APP_VERSION = '1.0.0';

export default function Perfil() {
  const { contacts, refreshContacts } = useApp();
  const { colors, isDark } = useTheme();
  const [exporting, setExporting]       = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await exportDatabase();
      const json = JSON.stringify(data, null, 2);
      const fileUri = `${FileSystem.documentDirectory}aniversmart_backup.json`;
      await FileSystem.writeAsStringAsync(fileUri, json, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Exportar backup do AniverSmart',
      });
    } catch (e: any) {
      Alert.alert('Erro', `Não foi possível exportar: ${e.message}`);
    } finally {
      setExporting(false);
    }
  };

  const handleImportInfo = () => {
    Alert.alert(
      'Importar Backup',
      'Para importar, copie o arquivo de backup para o dispositivo e confirme. Esta ação adicionará os contatos do backup ao seu banco de dados atual.',
      [{ text: 'OK' }]
    );
  };

  const total    = contacts.length;
  const google   = contacts.filter(c => c.fromGoogle === 1).length;
  const manual   = total - google;

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
        <TouchableOpacity hitSlop={8} onPress={() => setShowSettings(true)}>
          <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Page title */}
        <View style={styles.hero}>
          <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>Perfil</Text>
          <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
            Configurações e backup
          </Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard label="TOTAL"  value={total}  color={colors.primary}  bg={colors.primaryLight}  />
          <StatCard label="MANUAL" value={manual}  color={colors.success}  bg={colors.successLight}  />
          <StatCard label="GOOGLE" value={google}  color="#3b82f6"         bg="#dbeafe"              />
        </View>

        {/* Backup section */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>BACKUP LOCAL</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MenuItem
              icon="cloud-upload-outline"
              iconBg={colors.primaryLight}
              iconColor={colors.primary}
              label="Exportar Contatos"
              onPress={handleExport}
              loading={exporting}
              colors={colors}
            />
            <View style={[styles.divider, { backgroundColor: colors.divider }]} />
            <MenuItem
              icon="cloud-download-outline"
              iconBg={colors.successLight}
              iconColor={colors.success}
              label="Importar Backup"
              onPress={handleImportInfo}
              colors={colors}
            />
          </View>
        </View>

        {/* About section */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>SOBRE O APP</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {/* App info */}
            <View style={styles.aboutRow}>
              <View style={[styles.appIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="sparkles" size={24} color="#fff" />
              </View>
              <View style={styles.aboutText}>
                <Text style={[styles.aboutName, { color: colors.textPrimary }]}>AniverSmart</Text>
                <Text style={[styles.aboutVersion, { color: colors.textMuted }]}>Versão {APP_VERSION}</Text>
              </View>
            </View>
            <Text style={[styles.aboutDesc, { color: colors.textSecondary }]}>
              Sincronização inteligente de contatos e lembretes automáticos para que você
              nunca perca uma data importante dos seus entes queridos.
            </Text>

            <View style={[styles.divider, { backgroundColor: colors.divider }]} />

            <MenuItem
              icon="information-circle-outline"
              iconBg={isDark ? colors.surfaceVariant : '#f1f5f9'}
              iconColor={colors.textSecondary}
              label="Sobre o App"
              desc={`Versão ${APP_VERSION}`}
              onPress={() => {}}
              colors={colors}
            />
            <View style={[styles.divider, { backgroundColor: colors.divider }]} />
            <MenuItem
              icon="star-outline"
              iconBg={isDark ? colors.surfaceVariant : '#fef9c3'}
              iconColor="#d97706"
              label="Avalie na App Store"
              onPress={() => {}}
              colors={colors}
            />
          </View>
        </View>

        {/* Privacy footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerPrivacy, { color: colors.primary }]}>Privacidade Total</Text>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Seus dados são processados localmente e nunca compartilhados com terceiros.
            © 2024 AniverSmart Labs.
          </Text>
        </View>
      </ScrollView>

      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
    </SafeAreaView>
  );
}

function StatCard({ label, value, color, bg }: {
  label: string; value: number; color: string; bg: string;
}) {
  return (
    <View style={[statStyles.card, { backgroundColor: bg }]}>
      <Text style={[statStyles.label, { color }]}>{label}</Text>
      <Text style={[statStyles.value, { color }]}>{value}</Text>
    </View>
  );
}

function MenuItem({ icon, iconBg, iconColor, label, desc, onPress, loading, colors }: {
  icon: string; iconBg: string; iconColor: string;
  label: string; desc?: string;
  onPress: () => void; loading?: boolean;
  colors: any;
}) {
  return (
    <TouchableOpacity style={menuStyles.row} onPress={onPress} disabled={loading} activeOpacity={0.7}>
      <View style={[menuStyles.iconBox, { backgroundColor: iconBg }]}>
        {loading
          ? <ActivityIndicator size="small" color={iconColor} />
          : <Ionicons name={icon as any} size={20} color={iconColor} />
        }
      </View>
      <View style={menuStyles.text}>
        <Text style={[menuStyles.label, { color: colors.textPrimary }]}>{label}</Text>
        {desc && <Text style={[menuStyles.desc, { color: colors.textMuted }]}>{desc}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
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
  body: { padding: 16, gap: 16, paddingBottom: 40 },
  hero: { paddingTop: 8 },
  pageTitle:    { fontSize: 28, fontWeight: '800', letterSpacing: -0.4 },
  pageSubtitle: { fontSize: 14, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10 },
  sectionBlock: { gap: 8 },
  sectionHeader: {
    fontSize: 12, fontWeight: '700', letterSpacing: 1,
    paddingHorizontal: 2,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  divider: { height: 1, marginHorizontal: 16 },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    paddingBottom: 12,
  },
  appIcon: {
    width: 52, height: 52, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  aboutText: { gap: 2 },
  aboutName: { fontSize: 18, fontWeight: '700' },
  aboutVersion: { fontSize: 13 },
  aboutDesc: {
    fontSize: 14, lineHeight: 21,
    paddingHorizontal: 16, paddingBottom: 16,
  },
  footer: { alignItems: 'center', gap: 6, paddingTop: 8 },
  footerPrivacy: { fontSize: 14, fontWeight: '700' },
  footerText: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
});

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 2,
  },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  value: { fontSize: 32, fontWeight: '800', letterSpacing: -1 },
});

const menuStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconBox: {
    width: 40, height: 40, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  text: { flex: 1 },
  label: { fontSize: 15, fontWeight: '500' },
  desc:  { fontSize: 12, marginTop: 1 },
});
