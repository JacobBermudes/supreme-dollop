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

  useEffect(() => {
    // Инициализируем WebApp и получаем данные пользователя из Telegram
    const isInTelegram = window.Telegram?.WebApp?.ready !== undefined;
    console.log('🔍 isInTelegram:', isInTelegram);
    
    if (isInTelegram && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();

      const initData = webApp.initDataUnsafe;
      const telegramUser = initData?.user;
      
      console.log('📞 Telegram initData:', initData);
      console.log('👤 Telegram user:', telegramUser);

      if (telegramUser) {
        setUser(telegramUser);

        // Отправляем POST-запрос на API с данными от Telegram
        const fetchApiData = async () => {
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
          }
        };

        fetchApiData();
      } else {
        // Даже если WebApp инициализирована, но нет user данных - используем mock
        console.log('⚠️ WebApp есть, но user пуст. Используем mock-данные.');
        const mockUser = { id: 287657335, username: 'mg' };
        setUser(mockUser);
        
        setApiData({
          username: 'mg',
          balance: 150.50,
          tariff: 'Премиум',
          active: 'yes',
          message: 'Mock-данные (WebApp без user)'
        });
      }
    } else {
      // Для локального тестирования (вне Telegram) - npm run dev
      console.log('📱 WebApp не обнаружена. Загружаем mock-данные для разработки...');
      const mockUser = { id: 287657335, username: 'mg' };
      setUser(mockUser);
      
      // Имитируем ответ от API
      setApiData({
        username: 'mg',
        balance: 150.50,
        tariff: 'Премиум',
        active: 'yes',
        message: 'Данные получены локально для тестирования'
      });
    }
  }, []);

  return (
    <AppRoot>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '16px' }}>
        <Card style={{ width: '100%', maxWidth: '480px' }}>
          <div style={{ padding: '16px' }}>

            {apiData && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <Text variant="headline">Привет, {apiData.username || 'пользователь'}!</Text>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <Text>Ваш тариф: {apiData.tariff || 'Неизвестно'}</Text>
                </div>
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
