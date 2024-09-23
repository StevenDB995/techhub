import { Button, Flex, Result } from 'antd';
import routes from '../../routes';

function Error({ status = 'error', title = 'Sorry, something went wrong.', message }) {
  return (
    <Flex align="center" justify="center" style={{ height: '100%' }}>
      <Result
        status={status}
        title={title}
        subTitle={message}
        extra={<Button type="primary" href={routes.home}>Back Home</Button>}
      />
    </Flex>
  );
}

export default Error;
