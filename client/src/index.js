import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Fix #5: Warn early if env var missing
if (!process.env.REACT_APP_SERVER_URL) {
  console.error(
    '❌ REACT_APP_SERVER_URL is not set.\n' +
    '   Create client/.env with: REACT_APP_SERVER_URL=http://localhost:5001'
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
