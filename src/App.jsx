import React, { useEffect, useState } from "react";

function App() {
  const [userId, setUserId] = useState(null);
  const [keys, setKeys] = useState([]);
  const [authError, setAuthError] = useState("");

  window.onTelegramAuth = (user) => {
    fetch("/auth", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `id=${user.id}`,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setUserId(user.id);
          // userId теперь хранится в cookie на сервере
        } else {
          setAuthError("Ошибка авторизации");
        }
      });
  };

  useEffect(() => {
    if (!userId) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute("data-telegram-login", "mmcvpnbot");
      script.setAttribute("data-size", "large");
      script.setAttribute("data-userpic", "false");
      script.setAttribute("data-request-access", "write");
      script.setAttribute("data-callback", "onTelegramAuth");
      document.getElementById("tg-login").appendChild(script);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetch("/keys")
        .then((res) => res.json())
        .then((data) => setKeys(data.keys || []));
    }
  }, [userId]);

  return (
    <div style={{ padding: 40 }}>
      <h2>VPN Ключи Telegram</h2>
      {!userId && (
        <div>
          <div id="tg-login"></div>
          {authError && <div style={{ color: "red" }}>{authError}</div>}
        </div>
      )}
      {userId && (
        <div>
          <h3>Ваши ключи:</h3>
          <ul>
            {keys.map((key, idx) => (
              <li key={idx}>
                <code>{key}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
