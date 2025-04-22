import App from '@/App';
import AuthProvider from '@/contexts/AuthProvider';
import AboutPage from '@/pages/AboutPage';
import CreateBlogPage from '@/pages/blogs/CreateBlogPage';
import EditBlogPage from '@/pages/blogs/EditBlogPage';
import ViewBlogPage from '@/pages/blogs/ViewBlogPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import UserBlogsPage from '@/pages/profile/UserBlogsPage';
import { geekblue } from '@ant-design/colors';
import { App as AntdApp, ConfigProvider } from 'antd';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    children: [
      {
        path: '',
        element: <HomePage />
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: `blogs/:blogId`,
        element: <ViewBlogPage />
      },
      {
        path: 'blogs/create',
        element: <CreateBlogPage />
      },
      {
        path: `blogs/:blogId/edit`,
        element: <EditBlogPage />
      },
      {
        path: ':username/blogs',
        element: <UserBlogsPage />
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
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>
);
