import { App as AntdApp, Button, Flex, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/services/authService';
import routes from '../../routes';
import styles from './Login.module.css';

function Login() {
  const { message: antdMessage } = AntdApp.useApp();
  const navigate = useNavigate();

  const submit = async (formData) => {
    try {
      const response = await login(formData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      antdMessage.success('Successfully logged in!');
      navigate(routes.home);
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
        onFinish={submit}
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

export default Login;
