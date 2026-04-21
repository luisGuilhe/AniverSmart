import * as Calendar from 'expo-calendar';
import { insertContact, getAllContacts } from './database';
import { formatBirthDateForDB } from '../utils/formatting';

export interface CalendarContact {
  name: string;
  birthDate: string;
}

export async function requestCalendarPermission(): Promise<boolean> {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  return status === 'granted';
}

export async function syncBirthdaysFromCalendar(): Promise<{ added: number; skipped: number }> {
  const granted = await requestCalendarPermission();
  if (!granted) throw new Error('Permissão de calendário negada');

  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const twoYearsAhead = new Date();
  twoYearsAhead.setFullYear(twoYearsAhead.getFullYear() + 2);

  const birthdayCalendars = calendars.filter(
    c => c.title.toLowerCase().includes('aniversário') ||
         c.title.toLowerCase().includes('birthday') ||
         c.title.toLowerCase().includes('anniversaire')
  );

  const calendarIds = birthdayCalendars.length > 0
    ? birthdayCalendars.map(c => c.id)
    : calendars.map(c => c.id);

  const events = await Calendar.getEventsAsync(calendarIds, oneYearAgo, twoYearsAhead);

  const birthdayEvents = events.filter(e => {
    const title = e.title?.toLowerCase() ?? '';
    return title.includes('aniversário') || title.includes('birthday') || title.includes('anos');
  });

  const existingContacts = await getAllContacts();
  const existingNames = new Set(existingContacts.map(c => c.name.toLowerCase()));

  let added = 0;
  let skipped = 0;

  const seen = new Set<string>();

  for (const event of birthdayEvents) {
    const name = extractNameFromTitle(event.title ?? '');
    if (!name || seen.has(name.toLowerCase())) { skipped++; continue; }
    seen.add(name.toLowerCase());

    if (existingNames.has(name.toLowerCase())) { skipped++; continue; }

    const birthDate = event.startDate
      ? new Date(event.startDate).toISOString().split('T')[0]
      : null;

    if (!birthDate) { skipped++; continue; }

    await insertContact({
      name,
      birthDate,
      relationship: 'conhecido',
      phone: '',
      photoUri: undefined,
      fromGoogle: 1,
    });
    added++;
  }

  return { added, skipped };
}

function extractNameFromTitle(title: string): string {
  return title
    .replace(/aniversário (de |do |da )?/gi, '')
    .replace(/birthday( of| for)?/gi, '')
    .replace(/\b\d+ anos\b/gi, '')
    .trim();
}
