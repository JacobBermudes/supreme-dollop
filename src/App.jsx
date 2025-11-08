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

      const sendReq = async () =>{
      try {
        const resp = await fetch('http://phunkao.fun:8008/api', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({ id: initData.user?.id, username: initData.user?.username })
        });

        if (!resp.ok) {
          throw new Error(`HTTP Error. ${resp.status}: ${resp.statusText}`);
        }

        const data = await resp.json();
        setAccData(data || { tariff: 'Неизвестно', balance: 'Неизвестно', username: 'Гость', message: '' })
      } catch (err) {
        throw new Error(`HTTP Error. ${err.message}`);
      } 
    };
  sendReq();
  };
} ,[]);

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
      {accData?.message && (
        <div style={{ whiteSpace: 'pre-line', marginBottom: 20 }}>{accData.message}</div>
      )}
      <div className="id" onClick={() => copyToClipboard(user.username || '—')}>
        @{user.username || 'не указан'}
      </div>
      <div className="id" onClick={() => copyToClipboard(user.username || '—')}>
        @{user.username || 'Баланс неизвестен'}
      </div>
      <div className="id" onClick={() => copyToClipboard(user.username || '—')}>
        @{user.username || 'Тариф неизвестен'}
      </div>

      <button onClick={() => window.Telegram.WebApp.close()}>
        Закрыть
      </button>
    </div>
  );
}