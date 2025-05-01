import AppFooter from '@/layouts/AppFooter';
import AppNavbar from '@/layouts/AppNavbar';
import { Col, Layout, Row } from 'antd';
import { Outlet, useMatch } from 'react-router-dom';
import styles from './AppLayout.module.css';

const { Content } = Layout;

function AppLayout() {
  const matchSettings = useMatch('/settings');

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
      <AppFooter />
    </Layout>
  );
}

export default AppLayout;
