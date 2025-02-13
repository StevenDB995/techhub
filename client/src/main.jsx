import { geekblue } from '@ant-design/colors';
import { App as AntdApp, ConfigProvider } from 'antd';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import AuthProvider from './contexts/AuthProvider';
import About from './pages/About';
import Create from './pages/Create';
import Edit from './pages/Edit';
import Home from './pages/Home';
import Login from './pages/Login';
import MyBlogs from './pages/MyBlogs';
import Preview from './pages/Preview';
import View from './pages/View';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: `blogs/:blogId`,
        element: <View />
      },
      {
        path: 'my-blogs',
        element: <MyBlogs />
      },
      {
        path: 'my-blogs/create',
        element: <Create />
      },
      {
        path: `my-blogs/:blogId/edit`,
        element: <Edit />
      },
      {
        path: 'my-blogs/:blogId',
        element: <Preview />
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
          },
          Menu: {
            darkItemBg: 'transparent',
            darkSubMenuItemBg: 'transparent'
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
