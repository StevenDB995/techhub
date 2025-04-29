import { Button, Flex } from 'antd';

function FormActionButtons({ onCancel, disabled = false, loading = false }) {
  return (
    <Flex gap="small">
      <Button type="primary" htmlType="submit" disabled={disabled} loading={loading}>
        Save
      </Button>
      <Button onClick={onCancel}>
        Cancel
      </Button>
    </Flex>
  );
}

export default FormActionButtons;
