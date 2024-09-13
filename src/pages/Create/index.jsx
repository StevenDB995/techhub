import { Button, Flex } from 'antd';
import CherryEditor from '../../components/CherryEditor';

const buttonGroup = (
  <Flex gap="small" wrap className="button-group">
    <Button type="default" size="large" danger>Cancel</Button>
    <Button type="default" size="large">Save as Draft</Button>
    <Button type="primary" size="large">Post</Button>
  </Flex>
);

function Create() {
  return <CherryEditor buttonGroup={buttonGroup} />;
}

export default Create;
