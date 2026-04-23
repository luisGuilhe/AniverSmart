import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { documentDirectory, readAsStringAsync, writeAsStringAsync } from 'expo-file-system/legacy';
import Constants from 'expo-constants';
import { getAllContacts, insertNotificationRecord } from './database';
import { daysUntilBirthday } from '../utils/formatting';

const IS_EXPO_GO = Constants.appOwnership === 'expo';

const BACKGROUND_TASK = 'birthday-check';
const DAILY_CHECK_IDENTIFIER = 'aniversmart-daily-check';
const NOTIFIED_FILE = `${documentDirectory}notified_today.json`;

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

async function getNotifiedToday(): Promise<Set<number>> {
  try {
    const content = await readAsStringAsync(NOTIFIED_FILE);
    const { date, ids } = JSON.parse(content);
    if (date === todayKey()) return new Set<number>(ids);
  } catch {
    // arquivo não existe ou corrompido
  }
  return new Set<number>();
}

async function saveNotifiedToday(ids: Set<number>): Promise<void> {
  await writeAsStringAsync(
    NOTIFIED_FILE,
    JSON.stringify({ date: todayKey(), ids: [...ids] })
  );
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

let isChecking = false;

export async function checkAndNotifyBirthdays(): Promise<void> {
  if (isChecking) return;
  isChecking = true;
  try {
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
          // Mensagem genérica para não expor nome na tela de bloqueio
          body: 'Você tem um aniversário para comemorar. Abra o app para saber mais.',
          data: { contactId: contact.id },
          sound: true,
        },
        trigger: i === 0 ? null : {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: i * 2,
          repeats: false,
        },
      });
      await insertNotificationRecord(contact.id, contact.name);
      alreadyNotified.add(contact.id);
    }

    await saveNotifiedToday(alreadyNotified);
  } finally {
    isChecking = false;
  }
}

// Agenda notificação diária às 8h usando identificador fixo — NÃO cancela outras notificações
export async function scheduleDailyCheck(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(DAILY_CHECK_IDENTIFIER);
  } catch {
    // notificação ainda não existia, ok
  }

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_CHECK_IDENTIFIER,
    content: {
      title: '',
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

TaskManager.defineTask(BACKGROUND_TASK, async () => {
  try {
    await checkAndNotifyBirthdays();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundTask(): Promise<void> {
  if (IS_EXPO_GO) return;
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK);
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK, {
        minimumInterval: 60 * 60 * 8,
        stopOnTerminate: false,
        startOnBoot: true,
      });
    }
  } catch {
    // não suportado no dispositivo
  }
}
