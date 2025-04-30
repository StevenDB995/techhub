import { geekblue } from '@ant-design/colors';
import { Flex, Spin } from 'antd';
import styles from './Loading.module.css';

function Loading({ fullscreen = false, display = true, text = '' }) {
  return display && (
    <Flex
      justify="center"
      align="center"
      vertical={true}
      gap="middle"
      className={`${styles.loading} ${fullscreen && styles.fullscreen}`}
      style={{
        color: geekblue.primary,
        fontSize: '1.5em'
      }}
    >
      <Spin size="large" />
      {text}
    </Flex>
  );
}

export default Loading;
