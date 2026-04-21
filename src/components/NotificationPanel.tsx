import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../context/AppContext';
import { daysUntilBirthday, getBirthdayLabel, extractDigits } from '../utils/formatting';
import { Contact } from '../services/database';

interface Props {
  visible: boolean;
  onClose: () => void;
}

function ContactRow({ contact, colors }: { contact: Contact; colors: any }) {
  const days = daysUntilBirthday(contact.birthDate);
  const isToday = days === 0;

  const handleWhatsApp = async () => {
    const digits = extractDigits(contact.phone);
    const number = digits.startsWith('55') ? digits : `55${digits}`;
    await Linking.openURL(`https://wa.me/${number}`);
  };

  const initials = contact.name
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View style={[styles.row, { borderBottomColor: colors.divider }]}>
      <View style={[styles.rowAvatar, { backgroundColor: isToday ? colors.todayBadge : colors.soonBadge }]}>
        <Text style={styles.rowAvatarText}>{initials}</Text>
      </View>
      <View style={styles.rowInfo}>
        <Text style={[styles.rowName, { color: colors.textPrimary }]} numberOfLines={1}>
          {contact.name}
        </Text>
        <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
          {getBirthdayLabel(days)}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.waBtn, { backgroundColor: isToday ? '#25D366' : colors.surfaceVariant }]}
        onPress={handleWhatsApp}
        hitSlop={8}
      >
        <Ionicons name="logo-whatsapp" size={18} color={isToday ? '#fff' : colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

export function NotificationPanel({ visible, onClose }: Props) {
  const { colors } = useTheme();
  const { contacts } = useApp();

  const { todayBirthdays, soonBirthdays } = useMemo(() => {
    const today: Contact[] = [];
    const soon: Contact[] = [];
    for (const c of contacts) {
      const days = daysUntilBirthday(c.birthDate);
      if (days === 0) today.push(c);
      else if (days >= 1 && days <= 5) soon.push(c);
    }
    soon.sort((a, b) => daysUntilBirthday(a.birthDate) - daysUntilBirthday(b.birthDate));
    return { todayBirthdays: today, soonBirthdays: soon };
  }, [contacts]);

  const hasAny = todayBirthdays.length > 0 || soonBirthdays.length > 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayDismiss} onPress={onClose} activeOpacity={1} />
        <View style={[styles.panel, { backgroundColor: colors.surface }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <View style={[styles.panelHeader, { borderBottomColor: colors.divider }]}>
            <Text style={[styles.panelTitle, { color: colors.textPrimary }]}>Notificações</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {!hasAny && (
              <View style={styles.empty}>
                <Ionicons name="checkmark-circle-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Nenhum aniversário nos próximos 5 dias
                </Text>
              </View>
            )}

            {todayBirthdays.length > 0 && (
              <>
                <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
                  <Text style={[styles.sectionLabel, { color: colors.todayBadge }]}>🎂 Hoje</Text>
                  <View style={[styles.sectionBadge, { backgroundColor: colors.todayBadge }]}>
                    <Text style={styles.sectionBadgeText}>{todayBirthdays.length}</Text>
                  </View>
                </View>
                {todayBirthdays.map(c => (
                  <ContactRow key={c.id} contact={c} colors={colors} />
                ))}
              </>
            )}

            {soonBirthdays.length > 0 && (
              <>
                <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
                  <Text style={[styles.sectionLabel, { color: colors.soonBadge }]}>🗓 Próximos 5 dias</Text>
                  <View style={[styles.sectionBadge, { backgroundColor: colors.soonBadge }]}>
                    <Text style={styles.sectionBadgeText}>{soonBirthdays.length}</Text>
                  </View>
                </View>
                {soonBirthdays.map(c => (
                  <ContactRow key={c.id} contact={c} colors={colors} />
                ))}
              </>
            )}

            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayDismiss: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  panel: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 0,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  panelTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionBadge: {
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  sectionBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowAvatarText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowSub: {
    fontSize: 12,
    marginTop: 2,
  },
  waBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
