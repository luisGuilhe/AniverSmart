import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as FileSystem from 'expo-file-system';
import { getAllContacts } from './database';
import { daysUntilBirthday } from '../utils/formatting';

const BACKGROUND_TASK = 'birthday-check';
const NOTIFIED_FILE = `${FileSystem.documentDirectory}notified_today.json`;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// Retorna lista de IDs já notificados hoje
async function getNotifiedToday(): Promise<Set<number>> {
  try {
    const content = await FileSystem.readAsStringAsync(NOTIFIED_FILE);
    const { date, ids } = JSON.parse(content);
    if (date === todayKey()) return new Set<number>(ids);
  } catch {
    // arquivo não existe ou corrompido
  }
  return new Set<number>();
}

async function saveNotifiedToday(ids: Set<number>): Promise<void> {
  await FileSystem.writeAsStringAsync(
    NOTIFIED_FILE,
    JSON.stringify({ date: todayKey(), ids: [...ids] })
  );
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function checkAndNotifyBirthdays(): Promise<void> {
  const granted = await requestNotificationPermission();
  if (!granted) return;

  const contacts = await getAllContacts();
  const todayBirthdays = contacts.filter(c => daysUntilBirthday(c.birthDate) === 0);
  if (todayBirthdays.length === 0) return;

  const alreadyNotified = await getNotifiedToday();
  const toNotify = todayBirthdays.filter(c => !alreadyNotified.has(c.id));
  if (toNotify.length === 0) return;

  for (let i = 0; i < toNotify.length; i++) {
    const contact = toNotify[i];
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎂 Aniversário hoje!',
        body: `Hoje é aniversário de ${contact.name}. Não esqueça de parabenizar!`,
        data: { contactId: contact.id },
        sound: true,
      },
      trigger: i === 0 ? null : { seconds: i * 2, repeats: false },
    });
    alreadyNotified.add(contact.id);
  }

  await saveNotifiedToday(alreadyNotified);
}

// Agenda notificação diária às 8h para disparar o check
export async function scheduleDailyCheck(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🎂 Verificando aniversários...',
      body: '',
      data: { type: 'daily-check' },
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
    },
  });
}

// Background task — roda quando o app está em segundo plano
TaskManager.defineTask(BACKGROUND_TASK, async () => {
  try {
    await checkAndNotifyBirthdays();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundTask(): Promise<void> {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK, {
      minimumInterval: 60 * 60 * 8, // no mínimo a cada 8h (o SO decide quando executar)
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch {
    // já registrado ou não suportado no dispositivo
  }
}
