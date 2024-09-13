import { Col, Layout, Menu, Row } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import routes from './routes';
import './App.css';

const { Header, Content, Footer } = Layout;

function App() {
  const navItems = [
    {
      label: <Link to={routes.home}>Home</Link>,
      key: routes.home
    },
    {
      label: <Link to={routes.create}>Create</Link>,
      key: routes.create
    },
    {
      label: <Link to={routes.about}>About</Link>,
      key: routes.about
    }
  ];

  return (
    <Layout className="app">
      <Header className="app-header">
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[location.pathname]}
          items={navItems}
          className="menu"
        />
      </Header>
      <Content className="app-content">
        <Row justify="center" gutter={24}>
          <Col className="gutter-row" span={24} md={18}>
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