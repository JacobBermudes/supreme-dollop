import '@telegram-apps/telegram-ui/dist/styles.css';
import { useEffect, useState } from 'react';

import { AppRoot, Card, Text, Button } from '@telegram-apps/telegram-ui';

type TelegramUser = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
};

type ApiResponse = {
  [key: string]: any;
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
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Инициализируем WebApp и получаем данные пользователя из Telegram
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();

      const initData = webApp.initDataUnsafe;
      const telegramUser = initData?.user;

      if (telegramUser) {
        setUser(telegramUser);

        // Отправляем POST-запрос на API с данными от Telegram
        const fetchApiData = async () => {
          setLoading(true);
          try {
            const response = await fetch('https://phunkao.fun:8008/api', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: telegramUser.id,
                username: telegramUser.username,
                type: 'wa'
              })
            });

            if (response.ok) {
              const data = await response.json();
              setApiData(data);
            } else {
              console.error('API error:', response.status);
            }
          } catch (error) {
            console.error('Ошибка при запросе к API:', error);
          } finally {
            setLoading(false);
          }
        };

        fetchApiData();
      }
    } else {
      // Для локального тестирования (вне Telegram)
      console.warn('WebApp не инициализирован. Используем mock-данные.');
      setUser({ id: 287657335, username: 'mg' });
    }
  }, []);

  return (
    <AppRoot>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '16px' }}>
        <Card style={{ width: '100%', maxWidth: '480px' }}>
          <div style={{ padding: '16px' }}>
            <Text weight="2" style={{ marginBottom: '12px', fontSize: '24px', textAlign: 'center' }}>
              @{user?.username || 'loading...'}
            </Text>

            {loading && (
              <Text style={{ textAlign: 'center', color: '#999', marginBottom: '16px' }}>
                Загрузка данных...
              </Text>
            )}

            {apiData && (
              <div style={{ marginBottom: '16px' }}>
                <pre style={{ fontSize: '12px', overflow: 'auto', background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                  {JSON.stringify(apiData, null, 2)}
                </pre>
              </div>
            )}

            <Button onClick={() => window.Telegram?.WebApp?.close()}>
              Закрыть
            </Button>
          </div>
        </Card>
      </div>
    </AppRoot>
  );
};

export default App;
