import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useContacts } from '../hooks/useContacts';
import { useTheme } from '../hooks/useTheme';
import { ContactCard } from '../components/ContactCard';
import { ContactForm } from '../components/ContactForm';
import { MessagePreview } from '../components/MessagePreview';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Contact } from '../services/database';

export default function MeusContatos() {
  const { contacts, loading, addContact, editContact, removeContact } = useContacts();
  const { colors } = useTheme();

  const [search, setSearch]           = useState('');
  const [showForm, setShowForm]       = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();
  const [messageContact, setMessageContact] = useState<Contact | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return contacts;
    const q = search.toLowerCase();
    return contacts.filter(c => c.name.toLowerCase().includes(q));
  }, [contacts, search]);

  const handleEdit = useCallback((contact: Contact) => {
    setEditingContact(contact);
    setShowForm(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setEditingContact(undefined);
  }, []);

  const handleFormSubmit = useCallback(async (data: any) => {
    if (editingContact?.id) {
      await editContact(editingContact.id, data);
    } else {
      await addContact({ ...data, fromGoogle: 0 });
    }
  }, [editingContact, editContact, addContact]);

  if (loading && contacts.length === 0) {
    return <LoadingSpinner message="Carregando contatos..." />;
  }

  const ListEmpty = (
    <View style={styles.empty}>
      <View style={[styles.emptyIconWrap, { backgroundColor: colors.surfaceLow }]}>
        <Ionicons name="people-outline" size={40} color={colors.textMuted} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
        {search ? 'Nenhum resultado' : 'Nenhum contato ainda'}
      </Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {search
          ? `Nenhum contato com "${search}"`
          : 'Importe mais contatos para nunca\nesquecer um aniversário'}
      </Text>
      {!search && (
        <TouchableOpacity
          style={[styles.emptyBtn, { borderColor: colors.border }]}
          onPress={() => setShowForm(true)}
        >
          <Ionicons name="person-add-outline" size={18} color={colors.textSecondary} />
          <Text style={[styles.emptyBtnText, { color: colors.textSecondary }]}>
            Adicionar contato
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

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
        <TouchableOpacity hitSlop={8}>
          <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Page header */}
      <View style={[styles.pageHeader, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]}>
        <View style={styles.pageHeaderLeft}>
          <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>Meus{'\n'}Contatos</Text>
        </View>
        <View style={styles.pageHeaderRight}>
          <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.countBadgeNum}>{contacts.length}</Text>
            <Text style={styles.countBadgeLabel}>contato{contacts.length !== 1 ? 's' : ''}</Text>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setShowForm(true)}
          >
            <Ionicons name="person-add-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={[styles.searchWrap, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por nome ou data..."
            placeholderTextColor={colors.textMuted}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <ContactCard
            contact={item}
            onGenerateMessage={setMessageContact}
            onEdit={handleEdit}
            onDelete={c => removeContact(c.id)}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={ListEmpty}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        initialNumToRender={10}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setShowForm(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <ContactForm
        visible={showForm}
        initialData={editingContact}
        onSubmit={handleFormSubmit}
        onClose={handleFormClose}
      />

      <MessagePreview
        visible={!!messageContact}
        contact={messageContact}
        onClose={() => setMessageContact(null)}
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
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  pageHeaderLeft: { flex: 1 },
  pageTitle: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5, lineHeight: 38 },
  pageHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  countBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  countBadgeNum: { color: '#fff', fontSize: 16, fontWeight: '800', lineHeight: 18 },
  countBadgeLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600' },
  addBtn: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15 },
  list: { paddingTop: 10, paddingBottom: 100 },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyIconWrap: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  emptyText:  { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  emptyBtnText: { fontSize: 15, fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});
