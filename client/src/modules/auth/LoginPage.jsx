import { login } from '@/api/services/authService';
import useAuth from '@/hooks/useAuth';
import { App as AntdApp, Button, Flex, Form, Input } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

function LoginPage() {
  const { message: antdMessage } = AntdApp.useApp();
  const { setAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      const { accessToken, user } = await login(formData);
      setAuth(accessToken, user);
      antdMessage.success('Successfully logged in!');
      // Navigate to the previous location before the user logged in
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        antdMessage.error('Wrong username or password');
      } else {
        antdMessage.error('Unexpected error. Please try again later.');
      }
    }
  };

  return (
    <Flex justify="center" align="center" className={styles.loginContainer}>
      <Form
        className={styles.loginForm}
        layout="vertical"
        autoComplete="off"
        onFinish={handleLogin}
      >
        <Form.Item
          className={styles.formItem}
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className={styles.formItem}
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input password'
            }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item className={styles.buttonContainer}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
}

export default LoginPage;
