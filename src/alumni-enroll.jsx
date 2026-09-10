/**
 * alumni-enroll.jsx
 * Separate Vite entry point – completely independent of the main school app.
 * No Redux store, no React Router, no auth required.
 * Served at: /alumni-enroll.html
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import AlumniEnrollPage from '../packages/hrms-school-ui/src/pages/alumni/AlumniEnrollPage';

const container = document.getElementById('alumni-enroll-root');
createRoot(container).render(
  <React.StrictMode>
    <AlumniEnrollPage />
  </React.StrictMode>
);
