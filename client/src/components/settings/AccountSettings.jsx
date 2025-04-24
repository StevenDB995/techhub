import { Button, Flex, Form, Input, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';

const { Title } = Typography;

const formProps = {
  labelAlign: 'left',
  labelCol: { span: 6, xxl: 4 },
  wrapperCol: { span: 12, xxl: 8 }
};

function PersonalDetailsForm({ user }) {
  const [form] = Form.useForm();
  const [isEdited, setIsEdited] = useState(false);

  const initialValues = useMemo(() => ({
    email: user?.email
  }), [user]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const onCancel = () => {
    form.setFieldsValue(initialValues);
    setIsEdited(false);
  };

  return (
    <>
      <Title level={5}>Personal Details</Title>
      <Form
        form={form}
        onValuesChange={() => setIsEdited(true)}
        {...formProps}
      >
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
        {isEdited && <Form.Item>
          <Flex gap="small">
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button onClick={onCancel}>
              Cancel
            </Button>
          </Flex>
        </Form.Item>}
      </Form>
    </>
  );
}

function ResetPasswordForm() {
  const [form] = Form.useForm();
  const [isEdited, setIsEdited] = useState(false);

  const onCancel = () => {
    form.resetFields();
    setIsEdited(false);
  };

  return (
    <>
      <Title level={5}>Reset Password</Title>
      <Form
        form={form}
        onValuesChange={() => setIsEdited(true)}
        {...formProps}
      >
        <Form.Item name="password" label="New password">
          <Input.Password />
        </Form.Item>
        <Form.Item name="passwordConfirm" label="Confirm password">
          <Input.Password />
        </Form.Item>
        {isEdited && <Form.Item>
          <Flex gap="small">
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button onClick={onCancel}>
              Cancel
            </Button>
          </Flex>
        </Form.Item>}
      </Form>
    </>
  );
}

function AccountSettings({ user }) {
  return (
    <>
      <PersonalDetailsForm user={user} />
      <ResetPasswordForm />
    </>
  );
}

export default AccountSettings;
