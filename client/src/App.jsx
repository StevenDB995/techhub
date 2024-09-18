import { FormOutlined, InboxOutlined } from '@ant-design/icons';
import { Col, Dropdown, Flex, Layout, Menu, Row, Space } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import route from './route';
import './App.css';

const { Header, Content, Footer } = Layout;

function App() {
  // pages that display the header
  const headerPages = [route.home, route.about];
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      label: <Link to={route.home}>Home</Link>,
      key: route.home
    },
    {
      label: <Link to={route.about}>About</Link>,
      key: route.about
    }
  ];

  const dropdownMenuProps = {
    items: [
      {
        label: (
          <Link to={route.create}>
            <Space>
              <FormOutlined />New Blog
            </Space>
          </Link>
        ),
        key: route.create
      },
      {
        label: (
          <Link to={route.home}>
            <Space>
              <InboxOutlined />My Drafts
            </Space>
          </Link>
        ),
        key: route.home
      }
    ]
  };

  return (
    <Layout className="app">
      {headerPages.includes(location.pathname) && <Header className="app-header">
        <Flex flex="max-content" justify="space-between" align="center">
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[location.pathname]}
            items={navItems}
            className="left"
          />
          <div className="right">
            <Dropdown.Button
              type="primary"
              menu={dropdownMenuProps}
              onClick={() => navigate(route.create)}
            >
              Create
            </Dropdown.Button>
          </div>
        </Flex>
      </Header>}
      <Content className="app-content">
        <Row justify="center">
          <Col
            span={24}
            lg={headerPages.includes(location.pathname) ? 16 : undefined}
            className="display"
          >
            <Outlet />
          </Col>
        </Row>
      </Content>
      <Footer className="app-footer">
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
}

export default App;
