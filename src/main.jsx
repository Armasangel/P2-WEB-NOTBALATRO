import React from 'react';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

export default defineConfig({
    plugins: [react()]
});