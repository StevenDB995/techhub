import { GithubFilled, InstagramFilled, LinkedinFilled } from '@ant-design/icons';
import { Col, Flex, Layout, Row } from 'antd';
import request from 'axios';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import NewTabLink from './components/NewTabLink';
import useAuth from './hooks/useAuth';
import useAxios from './hooks/useAxios';
import routes from './routes';
import './App.css';

const { Content, Footer } = Layout;

// pages that do not display the header
const nonHeaderPages = [routes.create, routes.edit];

function App() {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const axios = useAxios();
  const location = useLocation();

  const shouldDisplayHeader = !nonHeaderPages.some((key) => location.pathname.startsWith(key));

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('/users/me')
        .then(res => setUser(res.data))
        .catch(err => console.error(err.message));
    }
  }, [isAuthenticated, axios]);

  useEffect(() => {
    request.get('/footer.json').then(res => {
      setFooterData(res.data);
    }).catch(err => console.error(err.message));
  }, []);

  return (
    <Layout className="app">
      {shouldDisplayHeader && <AppNavbar user={user} />}
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
