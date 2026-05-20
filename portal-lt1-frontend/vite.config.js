import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

const useHttps = process.env.VITE_DEV_HTTPS === 'true';

export default defineConfig({
  plugins: [react(), ...(useHttps ? [basicSsl()] : [])]
});
