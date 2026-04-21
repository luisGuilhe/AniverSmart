import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Modal, Image, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../hooks/useTheme';
import { RELATIONSHIP_TYPES } from '../utils/constants';
import { formatPhone, formatBirthDateForDB, formatBirthDateForDisplay } from '../utils/formatting';
import { validateContactForm, ContactFormErrors } from '../utils/validation';
import { Contact } from '../services/database';

interface FormData {
  name: string;
  birthDate: string;
  relationship: string;
  phone: string;
  photoUri?: string;
}

interface Props {
  visible: boolean;
  initialData?: Partial<Contact>;
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
}

export function ContactForm({ visible, initialData, onSubmit, onClose }: Props) {
  const { colors } = useTheme();

  const [name, setName]             = useState(initialData?.name ?? '');
  const [birthDate, setBirthDate]   = useState(
    initialData?.birthDate ? formatBirthDateForDisplay(initialData.birthDate) : ''
  );
  const [relationship, setRelationship] = useState(initialData?.relationship ?? '');
  const [phone, setPhone]           = useState(
    initialData?.phone ? formatPhone(initialData.phone) : ''
  );
  const [photoUri, setPhotoUri]     = useState(initialData?.photoUri ?? '');
  const [errors, setErrors]         = useState<ContactFormErrors>({});
  const [saving, setSaving]         = useState(false);
  const [showRelPicker, setShowRelPicker] = useState(false);

  const resetForm = useCallback(() => {
    setName(initialData?.name ?? '');
    setBirthDate(initialData?.birthDate ? formatBirthDateForDisplay(initialData.birthDate) : '');
    setRelationship(initialData?.relationship ?? '');
    setPhone(initialData?.phone ? formatPhone(initialData.phone) : '');
    setPhotoUri(initialData?.photoUri ?? '');
    setErrors({});
  }, [initialData]);

  const handleClose = () => { resetForm(); onClose(); };

  const handleSubmit = async () => {
    const formErrors = validateContactForm({ name, birthDate, relationship, phone });
    if (Object.keys(formErrors).length > 0) { setErrors(formErrors); return; }
    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        birthDate: formatBirthDateForDB(birthDate),
        relationship,
        phone: phone.replace(/\D/g, ''),
        photoUri: photoUri || undefined,
      });
      handleClose();
    } catch {
      // error handled upstream
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets[0]) setPhotoUri(result.assets[0].uri);
  };

  const handleBirthDateChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    else if (digits.length > 2) formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    setBirthDate(formatted);
  };

  const relLabel = RELATIONSHIP_TYPES.find(r => r.value === relationship)?.label ?? 'Selecione...';

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]}>
          <TouchableOpacity onPress={handleClose} hitSlop={8}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {initialData?.id ? 'Editar Contato' : 'Novo Contato'}
          </Text>
          <TouchableOpacity onPress={handleSubmit} disabled={saving} hitSlop={8}>
            {saving
              ? <ActivityIndicator size="small" color={colors.primary} />
              : <Text style={[styles.saveBtn, { color: colors.primary }]}>Salvar</Text>
            }
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          {/* Photo */}
          <TouchableOpacity style={styles.photoSection} onPress={pickImage}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            ) : (
              <View style={[styles.photoPlaceholder, { backgroundColor: colors.surfaceLow, borderColor: colors.border }]}>
                <Ionicons name="camera-outline" size={32} color={colors.textMuted} />
                <Text style={[styles.photoLabel, { color: colors.textMuted }]}>Adicionar Foto</Text>
              </View>
            )}
          </TouchableOpacity>

          <Field label="NOME COMPLETO" error={errors.name} colors={colors}>
            <View style={[styles.inputWrap, { backgroundColor: colors.surface, borderColor: errors.name ? colors.error : colors.border }]}>
              <Ionicons name="person-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Maria Oliveira"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
              />
            </View>
          </Field>

          <Field label="DATA DE NASCIMENTO" error={errors.birthDate} colors={colors}>
            <View style={[styles.inputWrap, { backgroundColor: colors.surface, borderColor: errors.birthDate ? colors.error : colors.border }]}>
              <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                value={birthDate}
                onChangeText={handleBirthDateChange}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </Field>

          <Field label="RELACIONAMENTO" error={errors.relationship} colors={colors}>
            <TouchableOpacity
              style={[styles.inputWrap, { backgroundColor: colors.surface, borderColor: errors.relationship ? colors.error : colors.border }]}
              onPress={() => setShowRelPicker(true)}
            >
              <Ionicons name="people-outline" size={18} color={colors.textMuted} />
              <Text style={[styles.input, styles.pickerText, { color: relationship ? colors.textPrimary : colors.textMuted }]}>
                {relLabel}
              </Text>
              <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </Field>

          <Field label="WHATSAPP" error={errors.phone} colors={colors}>
            <View style={[styles.inputWrap, { backgroundColor: colors.surface, borderColor: errors.phone ? colors.error : colors.border }]}>
              <Ionicons name="chatbubble-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                value={phone}
                onChangeText={t => setPhone(formatPhone(t))}
                placeholder="(11) 99999-9999"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>
          </Field>

          {/* Reminder toggle visual */}
          <View style={[styles.reminderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.reminderIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.reminderText}>
              <Text style={[styles.reminderTitle, { color: colors.textPrimary }]}>Lembrete automático</Text>
              <Text style={[styles.reminderDesc, { color: colors.textSecondary }]}>Notificar sobre aniversários e datas</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Relationship picker modal */}
      <Modal visible={showRelPicker} transparent animationType="slide" onRequestClose={() => setShowRelPicker(false)}>
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.overlayDismiss} onPress={() => setShowRelPicker(false)} activeOpacity={1} />
          <View style={[styles.pickerModal, { backgroundColor: colors.surface }]}>
            <View style={[styles.pickerHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.pickerModalTitle, { color: colors.textPrimary }]}>
              Tipo de Relacionamento
            </Text>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {RELATIONSHIP_TYPES.map(r => (
                <TouchableOpacity
                  key={r.value}
                  style={[
                    styles.pickerOption,
                    { borderBottomColor: colors.divider },
                    relationship === r.value && { backgroundColor: colors.primaryLight },
                  ]}
                  onPress={() => { setRelationship(r.value); setShowRelPicker(false); }}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    { color: relationship === r.value ? colors.primary : colors.textPrimary },
                    relationship === r.value && { fontWeight: '700' },
                  ]}>
                    {r.label}
                  </Text>
                  {relationship === r.value && (
                    <Ionicons name="checkmark" size={18} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

function Field({ label, error, children, colors }: {
  label: string; error?: string; children: React.ReactNode; colors: any;
}) {
  return (
    <View style={fieldStyles.container}>
      <Text style={[fieldStyles.label, { color: colors.textMuted }]}>{label}</Text>
      {children}
      {error && <Text style={[fieldStyles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: 6 },
  error: { fontSize: 12, marginTop: 4 },
});

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
  saveBtn: { fontSize: 16, fontWeight: '700' },
  body: { padding: 16, paddingBottom: 40 },
  photoSection: { alignItems: 'center', marginBottom: 24 },
  photo: { width: 100, height: 100, borderRadius: 50 },
  photoPlaceholder: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 2, borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center', gap: 4,
  },
  photoLabel: { fontSize: 12 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    minHeight: 50,
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 12 },
  pickerText: { flex: 1, paddingVertical: 14 },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  reminderIcon: {
    width: 40, height: 40, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  reminderText: { flex: 1 },
  reminderTitle: { fontSize: 15, fontWeight: '600' },
  reminderDesc: { fontSize: 13, marginTop: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  overlayDismiss: {
    flex: 1,
  },
  pickerModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    maxHeight: '75%',
  },
  pickerHandle: {
    width: 36, height: 4, borderRadius: 2,
    alignSelf: 'center', marginBottom: 16,
  },
  pickerModalTitle: {
    fontSize: 17, fontWeight: '700',
    marginBottom: 12, textAlign: 'center',
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderRadius: 8,
  },
  pickerOptionText: { fontSize: 16 },
});
