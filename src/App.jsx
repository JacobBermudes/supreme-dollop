import './App.css'
import { useEffect, useState } from 'react';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      const initData = window.Telegram.WebApp.initDataUnsafe;
      setUser(initData.user || { id: 'Неизвестно', username: 'Гость' });
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
      <p>Твой Telegram ID:</p>
      <div className="id" onClick={() => copyToClipboard(user.id)}>
        {user.id}
      </div>

      <p>Твой username:</p>
      <div className="id" onClick={() => copyToClipboard(user.username || '—')}>
        @{user.username || 'не указан'}
      </div>

      <button onClick={() => window.Telegram.WebApp.close()}>
        Закрыть
      </button>
    </div>
  );
}