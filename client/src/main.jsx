import { geekblue } from '@ant-design/colors';
import { App as AntdApp, ConfigProvider } from 'antd';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import ProtectedRoute from './components/ProtectedRoute';
import About from './pages/About';
import Create from './pages/Create';
import Edit from './pages/Edit';
import Home from './pages/Home';
import Login from './pages/Login';
import MyDrafts from './pages/MyDrafts';
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
        path: routes.login,
        element: <Login />
      },
      {
        path: routes.blogs,
        element: <Home />
      },
      {
        path: routes.about,
        element: <About />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: routes.create,
            element: <Create />
          },
          {
            path: `${routes.edit}/:blogId`,
            element: <Edit />
          },
          {
            path: routes.drafts,
            element: <MyDrafts />
          }
        ]
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
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>
);
