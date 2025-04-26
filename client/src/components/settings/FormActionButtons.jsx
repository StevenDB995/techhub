import { Button, Flex } from 'antd';

function FormActionButtons({ onCancel }) {
  return (
    <Flex gap="small">
      <Button type="primary" htmlType="submit">
        Save
      </Button>
      <Button onClick={onCancel}>
        Cancel
      </Button>
    </Flex>
  );
}

export default FormActionButtons;
