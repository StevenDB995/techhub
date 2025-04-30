import { Button, Flex, Result } from 'antd';
import styles from './Error.module.css';

function Error({ error, title = 'Sorry, something went wrong.' }) {
  const statusValues = ['error', '404', '403', '500'];

  let status = error.response?.status.toString();
  if (status === '401') {
    status = '403';
  } else if (!statusValues.includes(status)) {
    status = 'error';
  }

  return (
    <Flex align="center" justify="center" className={styles.errorContainer}>
      <Result
        status={status}
        title={title}
        subTitle={error.message}
        extra={<Button type="primary" href={'/'}>Back Home</Button>}
      />
    </Flex>
  );
}

export default Error;
