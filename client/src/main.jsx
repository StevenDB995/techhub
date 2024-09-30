import { geekblue } from '@ant-design/colors';
import { App as AntdApp, ConfigProvider } from 'antd';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import AuthProvider from './contexts/AuthProvider';
import About from './pages/About';
import Blogs from './pages/Blogs';
import Create from './pages/Create';
import Edit from './pages/Edit';
import Home from './pages/Home';
import Login from './pages/Login';
import routes from './routes';
import './index.css';

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
      },
      {
        path: routes.login,
        element: <Login />
      },
      {
        path: routes.blogs,
        element: <Blogs />
      },
      {
        path: routes.create,
        element: <Create />
      },
      {
        path: `${routes.edit}/:blogId`,
        element: <Edit />
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
      }}
    >
      <AntdApp
        message={{
          top: 72
        }}
      >
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  </StrictMode>
);
