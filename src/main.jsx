import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Create from './pages/Create';
import About from './pages/About';
import routes from './routes';
import { geekblue } from '@ant-design/colors';
import './index.css';
import { ConfigProvider } from 'antd';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: routes.home,
        element: <Home />
      },
      {
        path: routes.about,
        element: <About />
      }
    ]
  },
  {
    path: routes.create,
    element: <Create />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: geekblue.primary
        },
        components: {
          Layout: {
            headerBg: geekblue[8]
          }
        }
      }}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </StrictMode>
);
