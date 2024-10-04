import {
  CaretDownFilled,
  FormOutlined,
  GithubFilled,
  InboxOutlined,
  InstagramFilled,
  LinkedinFilled
} from '@ant-design/icons';
import { Button, Col, Dropdown, Flex, Layout, Menu, Row, Space } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import NewTabLink from './components/NewTabLink';
import useAuth from './hooks/useAuth';
import routes from './routes';
import './App.css';

const { Header, Content, Footer } = Layout;

// pages that do not display the header
const nonHeaderPages = [routes.create, routes.edit];

function App() {
  const { isAuthenticated, user } = useAuth();
  const [footerData, setFooterData] = useState(null);
  const location = useLocation();
  const shouldDisplayHeader = !nonHeaderPages.some((key) => location.pathname.startsWith(key));

  useEffect(() => {
    axios.get('/footer.json').then(res => {
      setFooterData(res.data);
    }).catch(err => console.error(err.message));
  }, []);

  const getSelectedKey = () => {
    if (location.pathname.startsWith(routes.blogs) ||
      location.pathname === routes.home) {
      return routes.home;
    }
    return location.pathname;
  };

  const navItems = [
    {
      label: <Link to={routes.home}>Home</Link>,
      key: routes.home
    },
    {
      label: <Link to={routes.about}>About</Link>,
      key: routes.about
    }
  ];

  const createDropdownItems = [
    {
      label: (
        <Link to={routes.create}>
          <Space>
            <FormOutlined />New Blog
          </Space>
        </Link>
      ),
      key: routes.create
    },
    {
      label: (
        <Link to={routes.blogs}>
          <Space>
            <InboxOutlined />My Blogs
          </Space>
        </Link>
      ),
      key: routes.blogs
    }
  ];

  const handleLogout = () => {
    console.log('logout');
  };

  const userDropdownItems = [
    {
      label: 'Logout',
      onClick: handleLogout,
      key: 'logout'
    }
  ];

  return (
    <Layout className="app">
      {shouldDisplayHeader && <Header className="app-header">
        <div className="brand">Steven&apos;s techHub</div>
        <Flex flex="max-content" justify="space-between" align="center">
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[getSelectedKey()]}
            items={navItems}
            className="left"
          />
          <div className="right">
            {
              isAuthenticated ?
                <Flex align="center" gap="middle">
                  <div>
                    <Dropdown.Button
                      type="primary"
                      menu={{ items: createDropdownItems }}
                    >
                      <Link to={routes.create}>Create</Link>
                    </Dropdown.Button>
                  </div>
                  <div>
                    <Dropdown menu={{ items: userDropdownItems }}>
                      <Space className="text-item">
                        {`Hi, ${user?.username}!`}<CaretDownFilled />
                      </Space>
                    </Dropdown>
                  </div>
                </Flex> :
                <Button type="text" className="text-item">
                  <Link to={routes.login}>Log In</Link>
                </Button>
            }
          </div>
        </Flex>
      </Header>}
      {shouldDisplayHeader ?
        <Content className="app-content">
          <Row justify="center">
            <Col span={24} lg={16} className="display">
              <Outlet />
            </Col>
          </Row>
        </Content> :
        <Content className="app-content">
          <Outlet />
        </Content>}
      <Footer className="app-footer">
        <div>Powered by StevenDB</div>
        <Flex gap="large" justify="center" className="social-media">
          <NewTabLink to={footerData?.links['github']} className="footer-link">
            <GithubFilled className="footer-icon" />
          </NewTabLink>
          <NewTabLink to={footerData?.links['linkedin']} className="footer-link">
            <LinkedinFilled className="footer-icon" />
          </NewTabLink>
          <NewTabLink to={footerData?.links['instagram']} className="footer-link">
            <InstagramFilled className="footer-icon" />
          </NewTabLink>
        </Flex>
      </Footer>
    </Layout>
  );
}

export default App;
