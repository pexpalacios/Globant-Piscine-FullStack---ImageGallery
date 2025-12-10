import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
	tailwindcss()
  	],
	server: {
		host: true,
		port: 5173,
		proxy: {
			'/api': {
				target: 'http://backend:3000',
				changeOrigin: true,
				secure: false, 
			},
			'/auth': {
				target: 'http://backend:3000',
				changeOrigin: true,
				secure: false, 
			}
		}
	}
})
