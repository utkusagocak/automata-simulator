import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Mobx configuration checks
if (
  !new (class {
    x: any;
  })().hasOwnProperty('x')
)
  throw new Error('Transpiler is not configured correctly');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
