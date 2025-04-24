import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Flex, Form, Input, Upload } from 'antd';
import { useEffect, useState } from 'react';

const avatarSize = 128;

function ProfileSettings({ user }) {
  const [hovering, setHovering] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      bio: user?.bio
    });
  }, [user, form]);

  return (
    <>
      <div
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{
          position: 'relative',
          width: avatarSize,
          height: avatarSize,
          marginBottom: 24
        }}
      >
        <Avatar src={user?.avatar} size={avatarSize} icon={<UserOutlined />} />
        {hovering && <Flex
          align="center"
          justify="center"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.6)'
          }}
        >
          <Upload>
            <Button
              variant="link"
              color="default"
              shape="circle"
              icon={<EditOutlined />}
              style={{
                width: avatarSize,
                height: avatarSize,
                fontSize: 24
              }}
            />
          </Upload>
        </Flex>}
      </div>
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item name="bio" label="Bio" wrapperCol={{ span: 24, md: 18 }}>
          <Input.TextArea maxLength={280} showCount={true} rows={4} />
        </Form.Item>
      </Form>
    </>
  );
}

export default ProfileSettings;
