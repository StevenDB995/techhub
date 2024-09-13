import { Button, Flex } from 'antd';
import CherryEditor from '../../components/CherryEditor';

const buttonGroup = (
  <Flex gap="middle" wrap className="button-group">
    <Button type="primary" size="large" danger>Delete</Button>
    <Button type="primary" size="large">Save</Button>
  </Flex>
);

function Edit() {
  return <CherryEditor buttonGroup={buttonGroup} />;
}

export default Edit;