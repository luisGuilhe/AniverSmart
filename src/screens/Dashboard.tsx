import React, { useMemo, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useContacts } from '../hooks/useContacts';
import { useTheme } from '../hooks/useTheme';
import { ContactCard } from '../components/ContactCard';
import { ContactForm } from '../components/ContactForm';
import { MessagePreview } from '../components/MessagePreview';
import { NotificationPanel } from '../components/NotificationPanel';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useBirthdayNotifications } from '../hooks/useBirthdayNotifications';
import { Contact } from '../services/database';
import { daysUntilBirthday } from '../utils/formatting';

type SortKey = 'days' | 'name' | 'relationship';

const SORT_LABELS: [SortKey, string][] = [
  ['days', 'Próximos'],
  ['name', 'A-Z'],
  ['relationship', 'Tipo'],
];

export default function Dashboard() {
  const { contacts, loadingContacts, refreshContacts } = useApp();
  const { addContact } = useContacts();
  const { colors } = useTheme();

  const [search, setSearch]         = useState('');
  const [sortKey, setSortKey]       = useState<SortKey>('days');
  const [showForm, setShowForm]         = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [messageContact, setMessageContact]       = useState<Contact | null>(null);
  const { totalCount } = useBirthdayNotifications();

  const thisMonthCount = useMemo(() => {
    const month = new Date().getMonth();
    return contacts.filter(c => {
      const parts = c.birthDate.split('-');
      return parseInt(parts[1], 10) - 1 === month;
    }).length;
  }, [contacts]);

  const sorted = useMemo(() => {
    let list = contacts;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = contacts.filter(c => c.name.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sortKey === 'days') return daysUntilBirthday(a.birthDate) - daysUntilBirthday(b.birthDate);
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      return a.relationship.localeCompare(b.relationship);
    });
  }, [contacts, search, sortKey]);

  const handleFormSubmit = useCallback(async (data: any) => {
    await addContact({ ...data, fromGoogle: 0 });
  }, [addContact]);

  if (loadingContacts && contacts.length === 0) {
    return <LoadingSpinner message="Carregando aniversários..." />;
  }

  const ListHeader = (
    <>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={[styles.heroGreeting, { color: colors.textPrimary }]}>Olá!</Text>
        <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
          {'Você tem '}
          <Text style={[styles.heroHighlight, { color: colors.primary }]}>
            {thisMonthCount} {thisMonthCount === 1 ? 'aniversário' : 'aniversários'}
          </Text>
          {' este mês.'}
        </Text>
      </View>

      {/* Search */}
      <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          value={search}
          onChangeText={setSearch}
          placeholder="Encontrar contatos..."
          placeholderTextColor={colors.textMuted}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Sort pills */}
      <View style={styles.sortRow}>
        {SORT_LABELS.map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.sortPill,
              {
                backgroundColor: sortKey === key ? colors.primary : 'transparent',
                borderColor: sortKey === key ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setSortKey(key)}
          >
            <Text style={[
              styles.sortPillText,
              { color: sortKey === key ? '#ffffff' : colors.textSecondary },
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const ListEmpty = (
    <View style={styles.empty}>
      <Ionicons name="people-outline" size={64} color={colors.textMuted} />
      <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
        {search ? 'Nenhum contato encontrado' : 'Sem aniversários ainda'}
      </Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {search
          ? 'Tente outro nome'
          : 'Toque em + para adicionar seu primeiro contato'}
      </Text>
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
        <TouchableOpacity hitSlop={8} onPress={() => setShowNotifications(true)}>
          <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
          {totalCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.todayBadge }]}>
              <Text style={styles.badgeText}>{totalCount > 9 ? '9+' : totalCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={sorted}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <ContactCard
            contact={item}
            onGenerateMessage={setMessageContact}
            compact
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loadingContacts}
            onRefresh={refreshContacts}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        initialNumToRender={8}
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
        onSubmit={handleFormSubmit}
        onClose={() => setShowForm(false)}
      />

      <MessagePreview
        visible={!!messageContact}
        contact={messageContact}
        onClose={() => setMessageContact(null)}
      />

      <NotificationPanel
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
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
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBarTitle: { fontSize: 17, fontWeight: '700' },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  hero: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  heroGreeting: { fontSize: 36, fontWeight: '800', letterSpacing: -0.5 },
  heroSub:      { fontSize: 16, marginTop: 4, lineHeight: 24 },
  heroHighlight: { fontWeight: '700' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15 },
  sortRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  sortPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  sortPillText: { fontSize: 14, fontWeight: '600' },
  list: { paddingBottom: 100 },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  emptyText:  { fontSize: 14, textAlign: 'center' },
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
