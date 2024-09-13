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

  const editorPages = [route.create, route.edit];
  const location = useLocation();

  return (
    <Layout className="app">
      {!editorPages.includes(location.pathname) && (<Header className="app-header">
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
          <Col span={24} md={!editorPages.includes(location.pathname) ? 18 : 24}>
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