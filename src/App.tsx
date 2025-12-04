import '@telegram-apps/telegram-ui/dist/styles.css';
import { useEffect, useState } from 'react';

import { AppRoot, Card, Section, Text, Button } from '@telegram-apps/telegram-ui';

type TelegramUser = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        initDataUnsafe: {
          user?: TelegramUser;
        };
        close: () => void;
      };
    };
  }
}

const App = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    // Инициализируем WebApp и получаем только данные пользователя из Telegram
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();

      const initData = webApp.initDataUnsafe;
      const telegramUser = initData?.user;

      if (telegramUser) {
        setUser(telegramUser);
      }
    } else {
      // Для локального тестирования (вне Telegram)
      console.warn('WebApp не инициализирован. Используем mock-данные.');
      setUser({ id: 123456, username: 'test_user', first_name: 'Test' });
    }
  }, []);

  return (
    <AppRoot>
      <Section style={{ marginTop: '16px', marginBottom: '16px' }}>
        <Card>
          <div style={{ padding: '16px' }}>
            <Text weight="2" style={{ marginBottom: '12px', fontSize: '20px' }}>
              Профиль
            </Text>

            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>
                Username
              </Text>
              <Text weight="2" style={{ fontSize: '18px' }}>
                @{user?.username || 'не указан'}
              </Text>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>
                ID
              </Text>
              <Text weight="2" style={{ fontSize: '18px' }}>
                {user?.id || '—'}
              </Text>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>
                Имя
              </Text>
              <Text weight="2" style={{ fontSize: '18px' }}>
                {user?.first_name || '—'} {user?.last_name || ''}
              </Text>
            </div>

            <Button onClick={() => window.Telegram?.WebApp?.close()}>
              Закрыть
            </Button>
          </div>
        </Card>
      </Section>
    </AppRoot>
  );
};

export default App;
