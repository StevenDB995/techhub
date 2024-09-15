import { Flex, Spin } from 'antd';

function Loading() {
  return (
    <Flex justify="center" align="center" style={{ height: '100vh' }}>
      <Spin size="large" />
    </Flex>
  );
}

export default Loading;
