import ReactDOM from 'react-dom/client'
import '@mantine/core/styles.css';
import App from './app/app';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MantineProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </MantineProvider>
)
