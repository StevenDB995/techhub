import { App as AntdApp, Button, Flex, Form, Input } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import useAuth from '../../hooks/useAuth';
import styles from './LoginPage.module.css';

function LoginPage() {
  const { api } = useApi();
  const { message: antdMessage } = AntdApp.useApp();
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Get the previous location the user was trying to access
  const from = location.state?.from;
  const fromUrl = from ? `${from.pathname}${from.search}` : '/';

  const handleLogin = async (formData) => {
    try {
      const response = await api.post('/auth/login', formData);
      const { accessToken } = response.data;
      login(accessToken);
      antdMessage.success('Successfully logged in!');
      navigate(fromUrl, { replace: true });
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
