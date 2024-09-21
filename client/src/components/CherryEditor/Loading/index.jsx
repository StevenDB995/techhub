import { Flex, Spin } from 'antd';
import styles from './Loading.module.css';

function Loading({ display = true }) {
  return display ? (
    <Flex justify="center" align="center" className={styles.loading}>
      <Spin size="large" />
    </Flex>
  ) : null;
}

export default Loading;
