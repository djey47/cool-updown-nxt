import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// TODO from config
const API_URL = 'http://localhost:3000';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: getProxyConfiguration('/config', '/power-on', '/diags', '/stats'),
  },
});

function getProxyConfiguration(...paths: string[]) {
  return paths.reduce((proxyConfiguration, p) => {
    proxyConfiguration[p] = {
      target: API_URL,
      changeOrigin: true,
      secure: false,
      ws: true,
    };
    return proxyConfiguration;
  }, {});
}