import { App as AntdApp, Button, Flex, Form, Input } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../../api/services/authService';
import useAuth from '../../hooks/useAuth';
import styles from './LoginPage.module.css';

function LoginPage() {
  const { message: antdMessage } = AntdApp.useApp();
  const { setAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      const response = await login(formData);
      const { accessToken } = response.data;
      setAuth(accessToken);
      antdMessage.success('Successfully logged in!');
      // Navigate to the previous location before the user logged in
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      if (err.status === 401) {
        antdMessage.error('Wrong username or password');
      } else {
        antdMessage.error(err.message);
      }
    }
  };

  return (
    <Flex justify="center" align="center" className={styles.loginContainer}>
      <Form
        className={styles.loginForm}
        autoComplete="off"
        onFinish={handleLogin}
        labelCol={{
          span: 24
        }}
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
