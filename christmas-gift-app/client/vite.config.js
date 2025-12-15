import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Tất cả request bắt đầu bằng /api
      // sẽ được forward sang http://localhost:5000
      '/api': 'http://localhost:5000'
    }
  }
});
