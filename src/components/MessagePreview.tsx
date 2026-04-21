import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  Modal, ActivityIndicator, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { Contact } from '../services/database';
import { sendWhatsAppMessage } from '../services/whatsapp';
import { useMessages } from '../hooks/useMessages';

interface Props {
  visible: boolean;
  contact: Contact | null;
  onClose: () => void;
}

export function MessagePreview({ visible, contact, onClose }: Props) {
  const { colors } = useTheme();
  const { generate, generating, saveMessageToHistory } = useMessages();
  const [message, setMessage]   = useState('');
  const [sending, setSending]   = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!contact) return;
    const msg = await generate(contact.id, contact.name, contact.relationship);
    setMessage(msg);
    setGenerated(true);
  };

  const handleSend = async () => {
    if (!contact || !message.trim()) return;
    setSending(true);
    try {
      const sent = await sendWhatsAppMessage(contact.phone, message);
      if (sent) {
        await saveMessageToHistory(contact.id, message);
        onClose();
      }
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    setGenerated(false);
    onClose();
  };

  if (!contact) return null;

  const initials = contact.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]}>
          <TouchableOpacity onPress={handleClose} hitSlop={8}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Mensagem de Aniversário
          </Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Contact info */}
          <View style={[styles.contactCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactName, { color: colors.textPrimary }]}>{contact.name}</Text>
              <Text style={[styles.contactPhone, { color: colors.textSecondary }]}>{contact.phone}</Text>
            </View>
          </View>

          {!generated ? (
            <TouchableOpacity
              style={[styles.generateBtn, { backgroundColor: colors.primaryButton }]}
              onPress={handleGenerate}
              disabled={generating}
              activeOpacity={0.85}
            >
              {generating ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <>
                  <Text style={[styles.generateBtnIcon, { color: colors.onPrimary }]}>✦</Text>
                  <Text style={[styles.generateBtnText, { color: colors.onPrimary }]}>Gerar Mensagem</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Mensagem (você pode editar):
              </Text>
              <TextInput
                style={[styles.messageInput, {
                  color: colors.textPrimary,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }]}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholderTextColor={colors.textMuted}
              />

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.regenerateBtn, { borderColor: colors.primary }]}
                  onPress={handleGenerate}
                  disabled={generating}
                >
                  <Ionicons name="refresh-outline" size={18} color={colors.primary} />
                  <Text style={[styles.regenerateBtnText, { color: colors.primary }]}>Gerar Outra</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.sendBtn, (!message.trim() || sending) && styles.disabledBtn]}
                  onPress={handleSend}
                  disabled={!message.trim() || sending}
                  activeOpacity={0.85}
                >
                  {sending ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                      <Text style={styles.sendBtnText}>Enviar via WhatsApp</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
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
  headerTitle: { fontSize: 17, fontWeight: '600' },
  body: { flex: 1, padding: 16, gap: 16 },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: '700' },
  contactPhone: { fontSize: 13, marginTop: 2 },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 16,
  },
  generateBtnIcon: { fontSize: 16, fontWeight: '700' },
  generateBtnText: { fontSize: 16, fontWeight: '700' },
  label: { fontSize: 13, fontWeight: '500' },
  messageInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    minHeight: 160,
  },
  actions: { gap: 10 },
  regenerateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  regenerateBtnText: { fontSize: 15, fontWeight: '600' },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25D366',
    borderRadius: 10,
    paddingVertical: 14,
  },
  disabledBtn: { opacity: 0.5 },
  sendBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
