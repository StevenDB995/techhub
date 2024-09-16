import { geekblue } from '@ant-design/colors';
import { ConfigProvider } from 'antd';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import About from './pages/About';
import Create from './pages/Create';
import Edit from './pages/Edit';
import Home from './pages/Home';
import route from './route';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: route.home,
        element: <Home />
      },
      {
        path: route.create,
        element: <Create />
      },
      {
        path: `${route.edit}/:blogId`,
        element: <Edit />
      },
      {
        path: route.about,
        element: <About />
      }
    ]
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
