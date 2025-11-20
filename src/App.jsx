import './App.css'
import { useEffect, useState } from 'react';

export default function App() {
  const [user, setUser] = useState(null);
  const [accData, setAccData] = useState(null)

  useEffect(() => {

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      const initData = window.Telegram.WebApp.initDataUnsafe;
      const userObj = initData && initData.user ? { id: initData.user.id, username: initData.user.username } : { id: 'Неизвестно', username: 'Гость' };
      setUser(userObj);

      const sendReq = async () =>{
        try {
          const resp = await fetch('https://phunkao.fun:8008/api', {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify(userObj)
          });

          if (!resp.ok) {
            throw new Error(`HTTP Error. OPCODE NOT OK. ${resp.status}: ${resp.statusText}`);
          }

          const data = await resp.json();
          setAccData(data || { tariff: 'Неизвестно', balance: 'Неизвестно', username: 'Гость', message: '' })
        } catch (err) {
          throw new Error(`HTTP Error.SOME ERROR. ${err.message}`);
        } 
      };
      sendReq();
    };
  } ,[]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    window.Telegram.WebApp.showAlert('Скопировано!');
  };

  if (!user || !accData) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="card">
      <h2>Привет голова!</h2>
      <div className="id" onClick={() => copyToClipboard(user.username || '—')}>
        @{user.username || 'не указан'}
      </div>
      <p>Баланс</p>
      <div className="id" onClick={() => copyToClipboard(accData.balance  || '—')}>
        {accData.balance !== undefined ? accData.balance : 'Баланс неизвестен'}
      </div>
      <p>Тариф</p>
      <div className="id" onClick={() => copyToClipboard(accData.tariff || '—')}>
        {accData.tariff || 'Тариф неизвестен'}
      </div>

      <button onClick={() => window.Telegram.WebApp.close()}>
        Закрыть
      </button>
    </div>
  );
}