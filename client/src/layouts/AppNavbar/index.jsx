import { logout } from '@/api/services/authService';
import NewTabLink from '@/components/NewTabLink';
import { BASE_SITE_CONTENT_URL } from '@/constants';
import useAuth from '@/hooks/useAuth';
import { geekblue } from '@ant-design/colors';
import {
  CaretDownFilled,
  FormOutlined,
  InboxOutlined,
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { App as AntdApp, Button, Col, Drawer, Dropdown, Flex, Grid, Image, Layout, Menu, Row, Space, Tour } from 'antd';
import { useRef, useState } from 'react';
import { Link, useLocation, useMatch, useNavigate } from 'react-router-dom';
import styles from './AppNavbar.module.css';

const { Header } = Layout;

function AppNavbar() {
  const { isAuthenticated, user, clearAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const matchUserBlogs = useMatch('/:username/blogs');
  const { message: antdMessage } = AntdApp.useApp();

  const screen = Grid.useBreakpoint();
  const isMobile = !screen.md;
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);

  const [hasVisited, setHasVisited] = useState(localStorage.getItem('hasVisited') || false);
  const loginRef = useRef(null);
  const aboutRef = useRef(null);
  const createRef = useRef(null);

  const tourSteps = [
    {
      title: 'Welcome to Steven\'s techHub!',
      description: <>
        <p>
          Log in as a visitor to experience more features including the first-class markdown editor and content
          management!
        </p>
        <p>
          Visitor account credentials:
        </p>
        <ul style={{ listStyleType: 'none' }}>
          <li>Username: <code>Visitor</code></li>
          <li>Password: <code>stevenIsAwesome!</code></li>
        </ul>
      </>,
      cover: <Image alt="demo" src={`${BASE_SITE_CONTENT_URL}/markdown-editor-demo.png`} />,
      target: () => loginRef.current
    },
    {
      title: 'About This Website',
      description: 'Check out the about page for more details and the visitor\'s login credentials.',
      target: () => aboutRef.current
    },
    {
      title: 'Create Time!',
      description: 'Now try creating a blog with the first-class markdown editor! Enjoy the journey 😄',
      target: () => createRef.current
    }
  ];

  const getSelectedKey = () => {
    if (!isMobile && matchUserBlogs) {
      return '/';
    }
    return location.pathname;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }

    clearAuth();
    navigate('/');
    antdMessage.info('You are logged out');
  };

  const expandDrawer = () => {
    setIsDrawerExpanded(true);
  };

  const hideDrawer = () => {
    setIsDrawerExpanded(false);
  };

  const brand = <div className={styles.brand}>Steven&apos;s techHub</div>;

  const leftNavItems = [
    {
      key: '/',
      label: <Link to={'/'}>Home</Link>
    },
    {
      key: '/about',
      label: <Link to={'/about'} ref={aboutRef}>About</Link>
    }
  ];

  const createDropdownItems = [
    {
      key: '/blogs/create',
      label: (
        <NewTabLink to={'/blogs/create'}>
          <Space>
            <FormOutlined />New Blog
          </Space>
        </NewTabLink>
      )
    },
    {
      key: `/${user?.username}/blogs`,
      label: (
        <Link to={`/${user?.username}/blogs`}>
          <Space>
            <InboxOutlined />My Blogs
          </Space>
        </Link>
      )
    }
  ];

  const userDropdownItems = [
    {
      key: '/settings',
      label: (
        <Link to={'/settings'}>
          <Space>
            <SettingOutlined />Settings
          </Space>
        </Link>
      )
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: (
        <Space>
          <LogoutOutlined />Logout
        </Space>
      ),
      onClick: handleLogout
    }
  ];

  const rightNavItems = isAuthenticated ? [
    {
      key: 'create',
      label: <Dropdown.Button
        type="primary"
        menu={{ items: createDropdownItems }}
      >
        <NewTabLink to={'/blogs/create'}>Create</NewTabLink>
      </Dropdown.Button>
    },
    {
      key: 'user',
      label: <Dropdown menu={{ items: userDropdownItems }}>
        <Space className={styles.textItem}>
          {`Hi, ${user?.username}!`}<CaretDownFilled />
        </Space>
      </Dropdown>
    }
  ] : [
    {
      key: 'create',
      label: <Button type="primary" ref={createRef}>
        <Link to={'/login'} state={{ from: location, redirect: '/blogs/create' }}>Create</Link>
      </Button>
    },
    {
      key: 'login',
      label: <Button type="link" className={styles.textItem} ref={loginRef}>
        <Link to={'/login'} state={{ from: location }}>Log In</Link>
      </Button>
    }
  ];

  const getMobileNavItems = () => {
    const mobileNavItems = [...leftNavItems];
    if (isAuthenticated) {
      mobileNavItems.push(...[
        {
          key: 'myBlogs',
          label: 'My Blogs',
          children: createDropdownItems
        },
        {
          key: 'user',
          label: 'User',
          children: userDropdownItems
        }
      ]);
    } else {
      mobileNavItems.push(...[
        {
          key: 'create',
          label: <Link to={'/login'} state={{ from: location, redirect: '/blogs/create' }}>Create</Link>
        },
        {
          key: '/login',
          label: <Link to={'/login'} state={{ from: location }}>Login</Link>
        }
      ]);
    }

    mobileNavItems.forEach(item => {
      item.onClick = hideDrawer;
    });

    return mobileNavItems;
  };

  const closeTour = () => {
    setHasVisited(true);
    localStorage.setItem('hasVisited', true);
  };

  return (
    <>
      <Row className={styles.appNavbar}>
        <Col span={0} md={24}>
          <Header className={styles.appHeader}>
            {brand}
            <Flex flex="max-content" justify="space-between" align="center">
              <Menu
                className={styles.left}
                theme="dark"
                mode="horizontal"
                selectedKeys={[getSelectedKey()]}
                items={leftNavItems}
              />
              <Menu
                className={styles.right}
                theme="dark"
                mode="horizontal"
                selectable={false}
                items={rightNavItems}
              />
            </Flex>
          </Header>
        </Col>
        <Col span={24} md={0}>
          <Header className={`${styles.appHeader} ${styles.mobile}`}>
            <Flex flex="max-content" justify="space-between" align="center">
              {brand}
              <Button type="primary" onClick={expandDrawer}>
                <MenuOutlined />
              </Button>
            </Flex>
            <Drawer
              title={
                <Flex justify="space-between" align="center">
                  {brand}
                  <Button type="primary" onClick={hideDrawer}>
                    <MenuOutlined />
                  </Button>
                </Flex>
              }
              placement="top"
              height="auto"
              styles={{
                content: {
                  background: geekblue[8]
                },
                header: {
                  borderBottomColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
              closable={false}
              open={isDrawerExpanded}
              onClose={hideDrawer}
            >
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[getSelectedKey()]}
                items={getMobileNavItems()}
              />
            </Drawer>
          </Header>
        </Col>
      </Row>
      <Tour open={!hasVisited && !isAuthenticated && !isMobile} steps={tourSteps} onClose={closeTour} />
    </>
  );
}

export default AppNavbar;
