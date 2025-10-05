import { useEffect, useState } from "react";
import './App.css'

type TgUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  // ...другие поля Telegram WebApp User
};

declare global {
  interface Window {
    Telegram: any;
  }
}

function App() {
  const [user, setUser] = useState<TgUser | null>(null);

  useEffect(() => {
    // Проверяем, что WebApp API доступен
    if (window.Telegram && window.Telegram.WebApp) {
      const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
      if (tgUser) setUser(tgUser);
    }
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>VPN Ключи Telegram WebApp</h2>
      {!user ? (
        <div>Откройте приложение через Telegram</div>
      ) : (
        <div>
          <h3>Добро пожаловать, {user.first_name}!</h3>
          <p>ID: {user.id}</p>
          <p>Username: {user.username}</p>
          {/* Здесь можно запросить ключи с сервера по user.id */}
        </div>
      )}
    </div>
  );
}

export default App;
