import { geekblue } from '@ant-design/colors';
import { App as AntdApp, ConfigProvider } from 'antd';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import AuthProvider from './contexts/AuthProvider';
import AboutPage from './pages/AboutPage';
import CreateBlogPage from './pages/CreateBlogPage';
import EditBlogPage from './pages/EditBlogPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MyBlogsPage from './pages/MyBlogsPage';
import PreviewBlogPage from './pages/PreviewBlogPage';
import ViewBlogPage from './pages/ViewBlogPage';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
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
        path: 'my-blogs',
        element: <MyBlogsPage />
      },
      {
        path: 'my-blogs/create',
        element: <CreateBlogPage />
      },
      {
        path: `my-blogs/:blogId/edit`,
        element: <EditBlogPage />
      },
      {
        path: 'my-blogs/:blogId',
        element: <PreviewBlogPage />
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
