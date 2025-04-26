import FormActionButtons from '@/components/settings/FormActionButtons';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Flex, Form, Input, Upload } from 'antd';
import { useEffect, useMemo, useState } from 'react';

const avatarSize = 128;

function ProfileSettings({ user }) {
  const [form] = Form.useForm();
  const [hovering, setHovering] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  const initialValues = useMemo(() => ({
    bio: user?.bio
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
        <Avatar src={user?.avatar?.link} size={avatarSize} icon={<UserOutlined />} />
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
        onValuesChange={() => setIsEdited(true)}
      >
        <Form.Item name="bio" label="Bio" wrapperCol={{ span: 24, md: 18 }}>
          <Input.TextArea maxLength={280} showCount={true} rows={4} />
        </Form.Item>
        {isEdited && <Form.Item>
          <FormActionButtons onCancel={onCancel} />
        </Form.Item>}
      </Form>
    </>
  );
}

export default ProfileSettings;
