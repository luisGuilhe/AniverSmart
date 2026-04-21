import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface Props {
  title: string;
  subtitle?: string;
  rightAction?: { icon: string; onPress: () => void };
}

export function Header({ title, subtitle, rightAction }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]}>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      {rightAction && (
        <TouchableOpacity onPress={rightAction.onPress} style={styles.action} hitSlop={8}>
          <Ionicons name={rightAction.icon as any} size={24} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  textContainer: { flex: 1 },
  title:    { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 13, marginTop: 2 },
  action:   { padding: 8 },
});
