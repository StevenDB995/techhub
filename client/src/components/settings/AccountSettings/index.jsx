import FormActionButtons from '@/components/settings/FormActionButtons';
import useSettingsForm from '@/hooks/useSettingsForm';
import { Form, Input, Typography } from 'antd';
import { useMemo } from 'react';

const { Title } = Typography;

const formProps = {
  labelAlign: 'left',
  labelCol: { span: 6, xxl: 4 },
  wrapperCol: { span: 12, xxl: 8 }
};

function PersonalDetailsForm({ user }) {
  const initialValues = useMemo(() => ({
    email: user?.email
  }), [user?.email]);

  const {
    form,
    isEdited,
    isSubmitting,
    onValuesChange,
    resetForm,
    handleSubmit
  } = useSettingsForm(initialValues);

  return (
    <>
      <Title level={5}>Personal Details</Title>
      <Form
        form={form}
        onValuesChange={onValuesChange}
        onFinish={() => handleSubmit()}
        {...formProps}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        {isEdited && <Form.Item>
          <FormActionButtons onCancel={resetForm} loading={isSubmitting} />
        </Form.Item>}
      </Form>
    </>
  );
}

function ResetPasswordForm() {
  const {
    form,
    isEdited,
    isSubmitting,
    onValuesChange,
    resetForm,
    handleSubmit
  } = useSettingsForm();

  return (
    <>
      <Title level={5}>Reset Password</Title>
      <Form
        form={form}
        onValuesChange={onValuesChange}
        onFinish={() => handleSubmit('New password set successfully!')}
        {...formProps}
      >
        <Form.Item
          name="password"
          label="New password"
          required={false}
          rules={[
            {
              required: true,
              message: 'Input new password'
            }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="passwordConfirm"
          label="Confirm password"
          required={false}
          rules={[
            {
              required: true,
              message: 'Please confirm password!'
            },
            ({ getFieldValue }) => ({
              validator(_, passwordConfirm) {
                const password = getFieldValue('password');
                if (password && passwordConfirm && password !== passwordConfirm) {
                  return Promise.reject(new Error('Passwords do not match!'));
                }
                return Promise.resolve();
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>
        {isEdited && <Form.Item>
          <FormActionButtons onCancel={resetForm} loading={isSubmitting} />
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
