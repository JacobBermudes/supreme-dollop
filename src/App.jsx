import './App.css'
import { useEffect, useState } from 'react';

export default function App() {
  const [user, setUser] = useState(null);
  const [accData, setAccData] = useState(null);
  const [showTariffSelect, setShowTariffSelect] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState("");
  const [tariffChanged, setTariffChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const tariffs = ["Стандартный", "Премиум", "Безлимитный"];

  useEffect(() => {

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      const initData = window.Telegram.WebApp.initDataUnsafe;
      const userObj = initData && initData.user ? { id: initData.user.id, username: initData.user.username } : { id: '0', username: 'Гость' };
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

  const handleTariffClick = () => {
    setShowTariffSelect(true);
    setSelectedTariff(accData.tariff || "");
  };

  const handleTariffChange = (e) => {
    setSelectedTariff(e.target.value);
    setTariffChanged(e.target.value !== accData.tariff);
  };

  const handleTariffSave = async () => {
    setLoading(true);
    try {
      const resp = await fetch('https://phunkao.fun:8008/api', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ ...user, tariff: selectedTariff })
      });
      if (!resp.ok) {
        throw new Error(`HTTP Error. OPCODE NOT OK. ${resp.status}: ${resp.statusText}`);
      }
      const data = await resp.json();
      setAccData(data || { tariff: 'Неизвестно', balance: 'Неизвестно', username: 'Гость', message: '' });
      setShowTariffSelect(false);
      setTariffChanged(false);
    } catch (err) {
      window.Telegram.WebApp.showAlert('Ошибка при смене тарифа!');
    }
    setLoading(false);
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
      {!showTariffSelect ? (
        <div className="id" style={{cursor:'pointer'}} onClick={handleTariffClick}>
          {accData.tariff || 'Тариф неизвестен'}
        </div>
      ) : (
        <>
          <select value={selectedTariff} onChange={handleTariffChange} style={{marginBottom: 10}}>
            {tariffs.map(tariff => (
              <option key={tariff} value={tariff}>{tariff}</option>
            ))}
          </select>
          {tariffChanged && (
            <button onClick={handleTariffSave} disabled={loading} style={{marginLeft: 10}}>
              {loading ? 'Сохраняем...' : 'Сохранить тариф'}
            </button>
          )}
          <button onClick={() => setShowTariffSelect(false)} style={{marginLeft: 10}}>Отмена</button>
        </>
      )}
      <button onClick={() => window.Telegram.WebApp.close()} style={{marginTop: 20}}>
        Закрыть
      </button>
    </div>
  );
}