import { uploadImage } from '@/api/external/imgur';
import { updateCurrentUser } from '@/api/services/userService';
import FormActionButtons from '@/components/settings/FormActionButtons';
import useApiErrorHandler from '@/hooks/useApiErrorHandler';
import { validateFileType } from '@/utils/fileUploadUtil';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { App as AntdApp, Avatar, Button, Flex, Form, Input, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useEffect, useMemo, useState } from 'react';
import styles from './ProfileSettings.module.css';

const allowedFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];
const allowedFileExtensions = ['.jpg', '.jpeg', '.png'];

function ProfileSettings({ user, reloadUser }) {
  const [form] = Form.useForm();
  const [isEdited, setIsEdited] = useState(false);

  const { message: antdMessage } = AntdApp.useApp();
  const handleApiError = useApiErrorHandler();

  const initialValues = useMemo(() => ({
    bio: user?.bio
  }), [user]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const onFormCancel = () => {
    form.setFieldsValue(initialValues);
    setIsEdited(false);
  };

  const handleBeforeCrop = (file) => {
    return validateFileType(file, allowedFileTypes);
  };

  const handleBeforeUpload = (file) => {
    // Validate file type again to prevent uploading
    if (!validateFileType(file, allowedFileTypes)) {
      void antdMessage.error(`Unsupported file type. 
      Please upload an image of valid format (${allowedFileExtensions.join(', ')}).`, 5);
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleUpload = async ({ file }) => {
    try {
      // Upload image to Imgur
      let response = await uploadImage(file);
      const { data: imageMetadata } = response.data;
      // Update avatar of the user
      response = await updateCurrentUser({ avatar: imageMetadata });
      reloadUser(response.data);

    } catch (err) {
      if (err.source === 'imgur') {
        antdMessage.error('Cannot connect to image host, please try again later.');
        console.error(err);
      } else {
        handleApiError(err);
      }
    }
  };

  return (
    <div className={styles.profileSettings}>
      <div className={styles.avatarContainer}>
        <Avatar src={user?.avatar?.link} size={128} icon={<UserOutlined />} />
        <Flex
          align="center"
          justify="center"
          className={`${styles.avatarMask}`}
        >
          <ImgCrop
            quality={0.8}
            cropShape="round"
            modalTitle="Upload Avatar"
            beforeCrop={handleBeforeCrop}
          >
            <Upload
              accept={allowedFileExtensions.join(',')}
              showUploadList={false}
              beforeUpload={handleBeforeUpload}
              customRequest={handleUpload}
            >
              <Button
                variant="link"
                color="default"
                shape="circle"
                icon={<EditOutlined />}
                className={styles.uploadButton}
              />
            </Upload>
          </ImgCrop>
        </Flex>
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
          <FormActionButtons onCancel={onFormCancel} />
        </Form.Item>}
      </Form>
    </div>
  );
}

export default ProfileSettings;
