import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useApp } from '../context/AppContext';
import { NotificationRecord } from '../services/database';

interface Props {
  visible: boolean;
  onClose: () => void;
}

function formatRelativeDate(sentAt: string): string {
  const sent = new Date(sentAt);
  const now = new Date();
  const diffMs = now.getTime() - sent.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hh = String(sent.getHours()).padStart(2, '0');
  const mm = String(sent.getMinutes()).padStart(2, '0');
  if (diffDays === 0) return `Hoje às ${hh}:${mm}`;
  if (diffDays === 1) return `Ontem às ${hh}:${mm}`;
  if (diffDays < 7) return `Há ${diffDays} dias`;
  const dd = String(sent.getDate()).padStart(2, '0');
  const mo = String(sent.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mo}`;
}

function NotificationRow({
  record, colors, onPress,
}: {
  record: NotificationRecord; colors: any; onPress: () => void;
}) {
  const initials = record.contactName
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <TouchableOpacity
      style={[
        rowStyles.row,
        { borderBottomColor: colors.divider },
        !record.isRead && { backgroundColor: colors.primaryLight },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[rowStyles.avatar, { backgroundColor: record.isRead ? colors.surfaceVariant : colors.primary }]}>
        <Text style={[rowStyles.avatarText, { color: record.isRead ? colors.textSecondary : '#fff' }]}>
          {initials}
        </Text>
      </View>

      <View style={rowStyles.info}>
        <Text style={[rowStyles.name, { color: colors.textPrimary }]} numberOfLines={1}>
          {record.contactName}
        </Text>
        <Text style={[rowStyles.sub, { color: colors.textSecondary }]}>
          🎂 Aniversário · {formatRelativeDate(record.sentAt)}
        </Text>
      </View>

      {!record.isRead && (
        <View style={[rowStyles.dot, { backgroundColor: colors.primary }]} />
      )}
      {record.isRead && (
        <Ionicons name="checkmark-done" size={16} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

export function NotificationPanel({ visible, onClose }: Props) {
  const { colors } = useTheme();
  const { notificationHistory, unreadCount, markNotificationRead, markAllNotificationsRead } = useApp();

  const handleMarkAll = () => {
    Alert.alert(
      'Marcar todas como lidas',
      'Deseja marcar todas as notificações como lidas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: markAllNotificationsRead },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayDismiss} onPress={onClose} activeOpacity={1} />
        <View style={[styles.panel, { backgroundColor: colors.surface }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <View style={[styles.panelHeader, { borderBottomColor: colors.divider }]}>
            <Text style={[styles.panelTitle, { color: colors.textPrimary }]}>Notificações</Text>
            <View style={styles.headerActions}>
              {unreadCount > 0 && (
                <TouchableOpacity
                  onPress={handleMarkAll}
                  style={[styles.markAllBtn, { backgroundColor: colors.primaryLight }]}
                  hitSlop={8}
                >
                  <Text style={[styles.markAllText, { color: colors.primary }]}>Marcar todas</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {notificationHistory.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                  Nenhuma notificação
                </Text>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  As notificações de aniversário aparecerão aqui
                </Text>
              </View>
            ) : (
              notificationHistory.map(record => (
                <NotificationRow
                  key={record.id}
                  record={record}
                  colors={colors}
                  onPress={() => { if (!record.isRead) markNotificationRead(record.id); }}
                />
              ))
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  markAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 10,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
  },
  sub: {
    fontSize: 12,
    marginTop: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
