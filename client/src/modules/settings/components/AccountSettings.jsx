import FormActionButtons from '@/modules/settings/components/FormActionButtons';
import useSettingsForm from '@/modules/settings/hooks/useSettingsForm';
import { isValidPassword } from '@/utils/validateUtil';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Input, Typography } from 'antd';
import { useMemo } from 'react';
import styles from './AccountSettings.module.css';

const { Title } = Typography;

const formProps = {
  labelAlign: 'left',
  labelCol: { span: 6, xxl: 4 },
  wrapperCol: { span: 12, xxl: 8 }
};

const passwordTooltip = (
  <>
    Allowed characters:
    <ul>
      <li>English letters and digits;</li>
      <li>Special characters including: <code>._!@#$%^&*()[]-+=</code></li>
    </ul>
    The password must contain 8-30 characters.
  </>
);

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
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please input your email'
            },
            {
              type: 'email',
              message: 'Invalid email address!'
            }
          ]}
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
        onFinish={() => handleSubmit('Password changed successfully!')}
        {...formProps}
      >
        <Form.Item
          name="password"
          label="New password"
          tooltip={{
            title: <div className={styles.passwordTooltip}>{passwordTooltip}</div>,
            icon: <InfoCircleOutlined />
          }}
          required={false}
          hasFeedback
          rules={[
            () => ({
              validator(_, password) {
                if (!password) {
                  return Promise.reject(new Error('Input new password'));
                }
                if (!isValidPassword(password)) {
                  return Promise.reject(new Error('Password does not meet the requirements!'));
                }
                return Promise.resolve();
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="passwordConfirm"
          label="Confirm password"
          required={false}
          hasFeedback
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
      {/* Temporarily disable Visitor from changing password */}
      {user?.username !== 'Visitor' && <ResetPasswordForm />}
    </>
  );
}

export default AccountSettings;
