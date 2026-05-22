import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import CursorProvider from '@/components/layout/CursorProvider';
import SmoothScroll from '@/components/layout/SmoothScroll';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false, retry: 1 },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <SmoothScroll>
          <App />
          <CursorProvider />
        </SmoothScroll>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
