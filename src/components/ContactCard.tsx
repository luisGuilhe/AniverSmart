import React, { memo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Contact } from '../services/database';
import { useTheme } from '../hooks/useTheme';
import { daysUntilBirthday, formatBirthDateForDisplay } from '../utils/formatting';
import { RELATIONSHIP_LABELS, DAYS_SOON } from '../utils/constants';

interface Props {
  contact: Contact;
  onGenerateMessage: (contact: Contact) => void;
  onEdit?: (contact: Contact) => void;
  onDelete?: (contact: Contact) => void;
  compact?: boolean;
}

export const ContactCard = memo(function ContactCard({
  contact, onGenerateMessage, onEdit, onDelete, compact = false,
}: Props) {
  const { colors, isDark } = useTheme();
  const daysLeft = daysUntilBirthday(contact.birthDate);
  const isToday = daysLeft === 0;
  const isSoon  = daysLeft > 0 && daysLeft <= DAYS_SOON;

  const badgeBg = isToday ? colors.todayBadge : isSoon ? colors.soonBadge : colors.futureBadge;

  const initials = contact.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const avatarBg =
    colors.relationshipColors[contact.relationship] ?? colors.primary;

  const relLabel =
    (RELATIONSHIP_LABELS[contact.relationship] ?? contact.relationship).toUpperCase();

  const confirmDelete = () => {
    Alert.alert(
      'Remover contato',
      `Tem certeza que deseja remover ${contact.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => onDelete?.(contact) },
      ]
    );
  };

  return (
    <View style={[
      styles.card,
      {
        backgroundColor: colors.surface,
        borderColor: isToday ? colors.todayBadge : colors.border,
        borderWidth: isToday ? 1.5 : 1,
      },
    ]}>
      {/* Days badge — top right */}
      <View style={[styles.badge, { backgroundColor: badgeBg }]}>
        {isToday ? (
          <Text style={styles.badgeTodayText}>HOJE!</Text>
        ) : (
          <>
            <Text style={styles.badgeDays}>{daysLeft <= 99 ? daysLeft : '99+'}</Text>
            <Text style={styles.badgeUnit}>DIAS</Text>
          </>
        )}
      </View>

      {/* Top row: avatar + info */}
      <View style={styles.row}>
        <View style={styles.avatarWrap}>
          {contact.photoUri ? (
            <Image source={{ uri: contact.photoUri }} style={styles.avatarImg} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: avatarBg }]}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
            {contact.name}
          </Text>

          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {formatBirthDateForDisplay(contact.birthDate)}
            </Text>
          </View>

          <View style={[
            styles.relChip,
            { backgroundColor: isDark ? colors.surfaceVariant : colors.surfaceLow },
          ]}>
            <Text style={[styles.relChipText, { color: colors.textSecondary }]}>
              {relLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions row */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.mainBtn, { backgroundColor: colors.primaryButton }]}
          onPress={() => onGenerateMessage(contact)}
          activeOpacity={0.8}
        >
          <Text style={[styles.mainBtnIcon, { color: colors.onPrimary }]}>✦</Text>
          <Text style={[styles.mainBtnText, { color: colors.onPrimary }]}>Gerar Mensagem</Text>
        </TouchableOpacity>

        {!compact && onEdit && (
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.surfaceLow, borderColor: colors.border }]}
            onPress={() => onEdit(contact)}
          >
            <Ionicons name="pencil-outline" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        {!compact && onDelete && (
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.surfaceLow, borderColor: colors.border }]}
            onPress={confirmDelete}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: 16,
    top: 16,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 56,
  },
  badgeTodayText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  badgeDays: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 22,
  },
  badgeUnit: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 78,
    marginBottom: 14,
  },
  avatarWrap: { width: 54, height: 54 },
  avatarImg: { width: 54, height: 54, borderRadius: 12 },
  avatarPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: { fontSize: 20, fontWeight: '800', color: '#ffffff' },
  info: { flex: 1, gap: 5 },
  name: { fontSize: 17, fontWeight: '700', letterSpacing: -0.2 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  date: { fontSize: 13 },
  relChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  relChipText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6 },
  actions: { flexDirection: 'row', gap: 8 },
  mainBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 8,
    gap: 6,
  },
  mainBtnIcon: { fontSize: 14, fontWeight: '700' },
  mainBtnText: { fontSize: 14, fontWeight: '700' },
  iconBtn: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
});
