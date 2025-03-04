import { GithubFilled, InstagramFilled, LinkedinFilled } from '@ant-design/icons';
import { Col, Flex, Layout, Row } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import NewTabLink from './components/NewTabLink';
import './App.css';

const { Content, Footer } = Layout;

function App() {
  const [footerData, setFooterData] = useState(null);
  const matchCreate = useMatch('/blogs/create');
  const matchEdit = useMatch('/blogs/:blogId/edit');
  const shouldDisplayHeader = !(matchCreate || matchEdit);

  useEffect(() => {
    axios.get('/footer.json').then(res => {
      setFooterData(res.data);
    }).catch(err => console.error(err.message));
  }, []);

  return (
    <Layout className="app">
      {shouldDisplayHeader && <AppNavbar />}
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
