import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import GlobalProviders from './providers/globalProviders.tsx'
// import '../utils/socket'
import './styles/index.css'
import './styles/dialogs.scss'
import './styles/buttons.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <GlobalProviders>
      <App />
    </GlobalProviders>
  // </React.StrictMode>,
)
