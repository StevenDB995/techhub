import { geekblue } from '@ant-design/colors';
import { App as AntdApp, ConfigProvider } from 'antd';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
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
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AntdApp
      message={{
        top: 72
      }}
    >
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
        <RouterProvider router={router} />
      </ConfigProvider>
    </AntdApp>
  </StrictMode>
);
