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
      <div style={{position:'relative', display:'inline-block', width:'100%'}}>
        <div className="id" style={{cursor:'pointer', marginBottom: showTariffSelect ? 0 : 20, borderRadius: showTariffSelect ? '20px 20px 0 0' : '20px', boxShadow: showTariffSelect ? '0 4px 12px rgba(34,158,217,0.08)' : '', borderBottom: showTariffSelect ? '1px solid #229ED9' : 'none'}} onClick={handleTariffClick}>
          {accData.tariff || 'Тариф неизвестен'}
        </div>
        {showTariffSelect && (
          <div style={{position:'absolute', left:0, right:0, top:'100%', zIndex:10, background:'#fff', borderRadius:'0 0 20px 20px', boxShadow:'0 8px 24px rgba(34,158,217,0.12)', border:'1px solid #229ED9', borderTop:'none', padding:'16px 12px'}}>
            <select value={selectedTariff} onChange={handleTariffChange} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #229ED9', fontSize:'16px', marginBottom:'12px', background:'#f7fafd'}}>
              {tariffs.map(tariff => (
                <option key={tariff} value={tariff}>{tariff}</option>
              ))}
            </select>
            <div style={{display:'flex', gap:'10px'}}>
              {tariffChanged && (
                <button onClick={handleTariffSave} disabled={loading} style={{flex:1, background:'#229ED9', color:'#fff', borderRadius:'8px', border:'none', padding:'10px 0', fontWeight:'bold'}}>
                  {loading ? 'Сохраняем...' : 'Сохранить тариф'}
                </button>
              )}
              <button onClick={() => setShowTariffSelect(false)} style={{flex:1, background:'#eee', color:'#333', borderRadius:'8px', border:'none', padding:'10px 0', fontWeight:'bold'}}>Отмена</button>
            </div>
          </div>
        )}
      </div>
      <button onClick={() => window.Telegram.WebApp.close()} style={{marginTop: 20}}>
        Закрыть
      </button>
    </div>
  );
}