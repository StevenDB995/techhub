import { Button } from 'antd';
import CherryEditor from '../../components/CherryEditor';

function Edit() {
  const buttons = [
    <Button key="cancel" type="default" size="large" danger>Cancel</Button>,
    <Button key="save" type="primary" size="large">Save</Button>
  ];

  return (
    <CherryEditor buttons={buttons} buttonGap="middle" />
  );
}

export default Edit;