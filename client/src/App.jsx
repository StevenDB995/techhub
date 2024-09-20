import { FormOutlined, InboxOutlined } from '@ant-design/icons';
import { Col, Dropdown, Flex, Layout, Menu, Row, Space } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import routes from './routes';
import './App.css';

const { Header, Content, Footer } = Layout;

// pages that do not display the header
const nonHeaderPages = [routes.create, routes.edit];

function App() {
  const location = useLocation();
  const shouldDisplayHeader = !nonHeaderPages.some((key) => location.pathname.startsWith(key));

  const getSelectedKey = () => {
    if (location.pathname.startsWith(routes.blogs) ||
      location.pathname.startsWith(routes.drafts) ||
      location.pathname === routes.home) {
      return routes.blogs;
    }
    return location.pathname;
  };

  const navItems = [
    {
      label: <Link to={routes.blogs}>Blogs</Link>,
      key: routes.blogs
    },
    {
      label: <Link to={routes.about}>About</Link>,
      key: routes.about
    }
  ];

  const dropdownMenuProps = {
    items: [
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
          <Link to={routes.drafts}>
            <Space>
              <InboxOutlined />My Drafts
            </Space>
          </Link>
        ),
        key: routes.drafts
      }
    ]
  };

  return (
    <Layout className="app">
      {shouldDisplayHeader && <Header className="app-header">
        <Flex flex="max-content" justify="space-between" align="center">
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[getSelectedKey()]}
            items={navItems}
            className="left"
          />
          <div className="right">
            <Dropdown.Button
              type="primary"
              menu={dropdownMenuProps}
            >
              <Link to={routes.create}>Create</Link>
            </Dropdown.Button>
          </div>
        </Flex>
      </Header>}
      <Content className="app-content">
        <Row justify="center">
          <Col
            span={24}
            lg={shouldDisplayHeader ? 16 : undefined}
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
