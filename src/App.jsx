import './App.css'
import { useEffect, useState } from 'react';

export default function App() {
  const [user, setUser] = useState(null);
  const [accData, setAccData] = useState(null)

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      const initData = window.Telegram.WebApp.initDataUnsafe;
      setUser(initData.user || { id: 'Неизвестно', username: 'Гость' });

      const payload = {
        uid: 287657335,
        username: "user.username"
      };

      const sendReq = async () =>{
      try {
        const resp = await fetch('http://phunkao.fun:8008/api', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!resp.ok) {
          throw new Error(`HTTP Error. ${resp.status}: ${resp.statusText}`);
        }

        const tg_data = await resp.json();
        setAccData(tg_data|| { tariff: 'Неизвестно', balance: 'Неизвестно', username: 'Гость' })
      } catch (err) {
          throw new Error(`HTTP Error. ${err.message}`);
      } 
    };

    sendReq();
    }
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    window.Telegram.WebApp.showAlert('Скопировано!');
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="card">
      <h2>Привет!</h2>
      <div className="id" onClick={() => copyToClipboard(accData.username || '—')}>
        @{accData.username || 'не указан'}
      </div>
      <div className="id" onClick={() => copyToClipboard(accData.balance || '—')}>
        @{accData.balance || 'Баланс неизвестен'}
      </div>
      <div className="id" onClick={() => copyToClipboard(accData.tariff || '—')}>
        @{accData.tariff || 'Тариф неизвестен'}
      </div>

      <button onClick={() => window.Telegram.WebApp.close()}>
        Закрыть
      </button>
    </div>
  );
}