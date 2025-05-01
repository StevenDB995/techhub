import NewTabLink from '@/components/NewTabLink';
import AppNavbar from '@/layouts/AppNavbar';
import { GithubFilled, InstagramFilled, LinkedinFilled } from '@ant-design/icons';
import { Col, Flex, Layout, Row } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import styles from './AppLayout.module.css';

const { Content, Footer } = Layout;

function AppLayout() {
  const [footerData, setFooterData] = useState(null);
  const matchSettings = useMatch('/settings');

  useEffect(() => {
    axios.get('/footer.json').then(res => {
      setFooterData(res.data);
    }).catch(err => console.error(err));
  }, []);

  return (
    <Layout className={styles.layout}>
      <AppNavbar />
      <Content className={styles.content}>
        <Row justify="center">
          <Col span={24} lg={matchSettings ? 20 : 16} className={styles.display}>
            <Outlet />
          </Col>
        </Row>
      </Content>
      <Footer className={styles.footer}>
        <div>Powered by StevenDB</div>
        <Flex gap="large" justify="center" className={styles.socialMedia}>
          <NewTabLink to={footerData?.links['github']} className={styles.footerLink}>
            <GithubFilled className={styles.footerIcon} />
          </NewTabLink>
          <NewTabLink to={footerData?.links['linkedin']} className={styles.footerLink}>
            <LinkedinFilled className={styles.footerIcon} />
          </NewTabLink>
          <NewTabLink to={footerData?.links['instagram']} className={styles.footerLink}>
            <InstagramFilled className={styles.footerIcon} />
          </NewTabLink>
        </Flex>
      </Footer>
    </Layout>
  );
}

export default AppLayout;
