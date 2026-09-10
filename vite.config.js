import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env, .env.[mode], .env.local, .env.[mode].local
  const env = loadEnv(mode, process.cwd(), '')

  return {
  plugins: [react()],
  define: {
    // Polyfill process.env for libraries/code that use it (e.g. process.env.NODE_ENV)
    'process.env': { NODE_ENV: JSON.stringify(env.VITE_NODE_ENV || mode) },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './packages/hrms-common-components/src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@utils': path.resolve(__dirname, './packages/hrms-utility/src'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@school-hrms/common-components': path.resolve(__dirname, './packages/hrms-common-components/src'),
      '@school-hrms/utility': path.resolve(__dirname, './packages/hrms-utility/src'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-redux',
      'react-router-dom',
      'react-router',
      '@reduxjs/toolkit',
      '@tanstack/react-query',
      'recharts',
      'lucide-react',
      'axios',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-progress',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-slider',
      '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group',
    ],
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost',
    open: false,
    middlewareMode: false,
  },
  preview: {
    port: 4173,
  },
  build: {
    sourcemap: mode !== 'production',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        'alumni-enroll': path.resolve(__dirname, 'alumni-enroll.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react'],
          charts: ['recharts'],
        },
      },
    },
  },
  }
})