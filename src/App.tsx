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
  const [balance, setBalance] = useState<string | number>('—');
  const [tariff, setTariff] = useState<string>('—');

  useEffect(() => {
    // Инициализируем WebApp и получаем данные пользователя
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      const webApp = window.Telegram.WebApp;
      const initData = webApp.initDataUnsafe;

      if (initData?.user) {
        setUser(initData.user);
      }

      // Здесь можно добавить fetch к вашему API для получения баланса и тарифа
      // Пока используем mock-данные для локального тестирования
      setBalance('150.00');
      setTariff('Премиум');
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
                Баланс
              </Text>
              <Text weight="2" style={{ fontSize: '18px' }}>
                {balance}
              </Text>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>
                Тариф
              </Text>
              <Text weight="2" style={{ fontSize: '18px' }}>
                {tariff}
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
