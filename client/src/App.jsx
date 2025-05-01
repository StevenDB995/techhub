import AuthProvider from '@/contexts/AuthProvider';
import AppLayout from '@/layouts/AppLayout';
import LoginPage from '@/modules/auth/LoginPage';
import CreateBlogPage from '@/modules/blog/pages/CreateBlogPage';
import EditBlogPage from '@/modules/blog/pages/EditBlogPage';
import ViewBlogPage from '@/modules/blog/pages/ViewBlogPage';
import HomePage from '@/modules/home/HomePage';
import SettingsPage from '@/modules/settings/SettingsPage';
import UserBlogsPage from '@/modules/user/UserBlogsPage';
import AboutPage from '@/pages/AboutPage';
import { geekblue } from '@ant-design/colors';
import { App as AntdApp, ConfigProvider } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppLayout />,
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
          path: 'settings',
          element: <SettingsPage />
        },
        {
          path: `blogs/:blogId`,
          element: <ViewBlogPage />
        },
        {
          path: ':username/blogs',
          element: <UserBlogsPage />
        }
      ]
    },
    {
      path: '/blogs/create',
      element: <CreateBlogPage />
    },
    {
      path: `/blogs/:blogId/edit`,
      element: <EditBlogPage />
    }
  ]);

  return (
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
  );
}

export default App;
