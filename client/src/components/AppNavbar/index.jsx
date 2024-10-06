import { geekblue } from '@ant-design/colors';
import { CaretDownFilled, FormOutlined, InboxOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { App as AntdApp, Button, Col, Drawer, Dropdown, Flex, Layout, Menu, Row, Space } from 'antd';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import routes from '../../routes';
import styles from './AppNavbar.module.css';

const { Header } = Layout;

function AppNavbar({ user }) {
  const { isAuthenticated, logout } = useAuth();
  const axios = useAxios();
  const location = useLocation();
  const navigate = useNavigate();
  const { message: antdMessage } = AntdApp.useApp();

  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);

  const getSelectedKey = (mode) => {
    if (mode !== 'mobile' &&
      (location.pathname.startsWith(routes.blogs) || location.pathname === routes.home)) {
      return routes.home;
    }
    return location.pathname;
  };

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      logout();
      navigate(routes.home);
      void antdMessage.info('You are logged out');
    } catch (err) {
      console.error(err.message);
    }
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
      key: routes.home,
      label: <Link to={routes.home}>Home</Link>
    },
    {
      key: routes.about,
      label: <Link to={routes.about}>About</Link>
    }
  ];

  const createDropdownItems = [
    {
      key: routes.create,
      label: (
        <Link to={routes.create}>
          <Space>
            <FormOutlined />New Blog
          </Space>
        </Link>
      )
    },
    {
      key: routes.blogs,
      label: (
        <Link to={routes.blogs}>
          <Space>
            <InboxOutlined />My Blogs
          </Space>
        </Link>
      )
    }
  ];

  const userDropdownItems = [
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

  const rightNavItems = [
    {
      key: 'create',
      label: <Dropdown.Button
        type="primary"
        menu={{ items: createDropdownItems }}
      >
        <Link to={routes.create}>Create</Link>
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
      mobileNavItems.push({
        key: routes.login,
        label: <Link to={routes.login}>Login</Link>
      });
    }
    return mobileNavItems;
  };

  return (
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
            {
              isAuthenticated ?
                <Menu
                  className={styles.right}
                  theme="dark"
                  mode="horizontal"
                  selectable={false}
                  items={rightNavItems}
                /> :
                <Button type="text" className={styles.textItem}>
                  <Link to={routes.login}>Log In</Link>
                </Button>
            }
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
            title={brand}
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
              selectedKeys={[getSelectedKey('mobile')]}
              items={getMobileNavItems()}
            />
          </Drawer>
        </Header>
      </Col>
    </Row>
  );
}

export default AppNavbar;
