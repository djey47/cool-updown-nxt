import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: getProxyConfiguration('/config', '/power-on', '/diags'),
  },
});

function getProxyConfiguration(...paths: string[]) {
  return paths.reduce((proxyConfiguration, p) => {
    proxyConfiguration[p] = {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
      ws: true,
    };
    return proxyConfiguration;
  }, {});
}