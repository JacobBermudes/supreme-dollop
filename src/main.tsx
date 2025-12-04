import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

import { AppRoot } from '@telegram-apps/telegram-ui';

createRoot(document.getElementById('root') as HTMLElement).render(
  <AppRoot>
    <App />
  </AppRoot>
);
