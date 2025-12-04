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
    const isInTelegram = window.Telegram?.WebApp?.ready !== undefined;
    console.log('🔍 isInTelegram:', isInTelegram);
    
    if (isInTelegram && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();

      const initData = webApp.initDataUnsafe;
      const telegramUser = initData?.user;
      
      console.log('Telegram initData:', initData);
      console.log('Telegram user:', telegramUser);

      if (telegramUser) {
        setUser(telegramUser);

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
        // mock
        console.log('WebApp есть, но user пуст. Используем mock-данные.');
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
      console.log('WebApp не обнаружена. Загружаем mock-данные для разработки...');
      const mockUser = { id: 287657335, username: 'mg' };
      setUser(mockUser);
      
      setApiData({
        username: 'mg',
        balance: 150.50,
        tariff: 'Премиум',
        active: 'yes',
        message: 'Данные получены локально для тестирования'
      });
    }
  }, []);
  
  // Small circular stat component
  const Circle = ({ value, label }: { value: number; label: string }) => {
    const radius = 36;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const balanceNum = Number(apiData?.balance) || 0;
    const percent = balanceNum > 0 ? Math.max(0, Math.min(1, value / balanceNum)) : 0;
    const strokeDashoffset = circumference - percent * circumference;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 120 }}>
        <svg height={radius * 2} width={radius * 2}>
          <g transform={`translate(${radius}, ${radius})`}>
            <circle
              r={normalizedRadius}
              fill="transparent"
              stroke="#eee"
              strokeWidth={stroke}
            />
            <circle
              r={normalizedRadius}
              fill="transparent"
              stroke="#229ED9"
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90)`}
            />
          </g>
        </svg>
        <div style={{ marginTop: 8, textAlign: 'center' }}>
          <Text style={{ fontSize: 14 }}>{label}</Text>
        </div>
      </div>
    );
  };

  const balanceNum = Number(apiData?.balance) || 0;
  const dayOfMonth = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const perDay = 100 - dayOfMonth;
  const perMonth = 100 - daysInMonth;

  return (
    <AppRoot>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '16px' }}>
        <Card style={{ width: '100%', maxWidth: '480px' }}>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {apiData && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ marginBottom: '8px', textAlign: 'center' }}>
                  <Text style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>Привет, {apiData.username}!</Text>
                </div>

                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8, marginBottom: 12 }}>
                  <Circle value={perDay} label={`Сервер Стандарт`} />
                  <Circle value={perMonth} label={`Сервер Премиум`} />
                </div>

                <div style={{ textAlign: 'center', color: '#666', fontSize: 13 }}>
                  <Text>Баланс: {Number(apiData.balance).toFixed(2)}</Text>
                </div>
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
