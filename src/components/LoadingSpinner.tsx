import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Props {
  message?: string;
}

export function LoadingSpinner({ message }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={[styles.text, { color: colors.textSecondary }]}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    fontSize: 16,
    marginTop: 8,
  },
});
