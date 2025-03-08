import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    base: '/',
    host: '0.0.0.0', // Allows access from other devices
    port: 5173, // Ensure this matches the port you're using
    strictPort: true, // Ensures Vite does not switch to another port if 5173 is in use
  }
  // server: {
  //   host: '0.0.0.0', // Allows access from other devices
  //   port: 5173, // Ensure this matches the port you're using
  //   strictPort: true, // Ensures Vite does not switch to another port if 5173 is in use
  // }
})
