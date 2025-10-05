import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'myvpn12.com',
    https: {
      key: fs.readFileSync('./myvpn12.com-key.pem'),
      cert: fs.readFileSync('./myvpn12.com.pem'),
    },
  },
});
