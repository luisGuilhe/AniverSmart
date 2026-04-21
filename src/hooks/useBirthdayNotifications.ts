import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { daysUntilBirthday } from '../utils/formatting';

export function useBirthdayNotifications() {
  const { contacts } = useApp();

  return useMemo(() => {
    let todayCount = 0;
    let soonCount = 0;
    for (const c of contacts) {
      const days = daysUntilBirthday(c.birthDate);
      if (days === 0) todayCount++;
      else if (days >= 1 && days <= 5) soonCount++;
    }
    return { todayCount, soonCount, totalCount: todayCount + soonCount };
  }, [contacts]);
}
