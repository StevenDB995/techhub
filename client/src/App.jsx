import { FormOutlined, InboxOutlined } from '@ant-design/icons';
import { Col, Dropdown, Flex, Layout, Menu, Row, Space } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import NewTabLink from './components/NewTabLink';
import route from './route';
import './App.css';

const { Header, Content, Footer } = Layout;

function App() {
  // pages that display the header
  const headerPages = [route.home, route.about, route.myDrafts];
  const location = useLocation();

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
          <NewTabLink to={route.create}>
            <Space>
              <FormOutlined />New Blog
            </Space>
          </NewTabLink>
        ),
        key: route.create
      },
      {
        label: (
          <Link to={route.myDrafts}>
            <Space>
              <InboxOutlined />My Drafts
            </Space>
          </Link>
        ),
        key: route.myDrafts
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
            >
              <NewTabLink to={route.create}>Create</NewTabLink>
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
