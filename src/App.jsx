import { Col, Layout, Menu, Row } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import route from './route';
import './App.css';

const { Header, Content, Footer } = Layout;

function App() {
  const navItems = [
    {
      label: <Link to={route.home}>Home</Link>,
      key: route.home
    },
    {
      label: <Link to={route.create}>Create</Link>,
      key: route.create
    },
    {
      label: <Link to={route.about}>About</Link>,
      key: route.about
    }
  ];

  // pages that display the header
  const headerPages = [route.home, route.about];
  const location = useLocation();

  return (
    <Layout className="app">
      {headerPages.includes(location.pathname) && (<Header className="app-header">
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[location.pathname]}
          items={navItems}
          className="menu"
        />
      </Header>)}
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