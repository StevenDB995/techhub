import { Button, Flex, Result } from 'antd';
import route from '../../route';

function Error({ status = 'error', message }) {
  return (
    <Flex align="center" justify="center" style={{ height: '100%' }}>
      <Result
        status={status}
        title="Sorry, something went wrong."
        subTitle={message}
        extra={<Button type="primary" href={route.home}>Back Home</Button>}
      />
    </Flex>
  );
}

export default Error;
