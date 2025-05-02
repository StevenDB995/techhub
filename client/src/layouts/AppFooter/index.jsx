import NewTabLink from '@/components/NewTabLink';
import { GithubFilled, InstagramFilled, LinkedinFilled } from '@ant-design/icons';
import { Flex, Layout } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from './AppFooter.module.css';

const { Footer } = Layout;

function AppFooter() {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    axios.get('/footer.json').then(res => {
      setFooterData(res.data);
    }).catch(err => console.error(err));
  }, []);

  return (
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
  );
}

export default AppFooter;
