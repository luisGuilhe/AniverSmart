import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const Typography = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 36,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 30,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textMuted,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
