import { updateCurrentUser } from '@/api/services/userService';
import useApiErrorHandler from '@/hooks/useApiErrorHandler';
import useAuth from '@/hooks/useAuth';
import { App as AntdApp, Form } from 'antd';
import { useCallback, useEffect, useState } from 'react';

const useSettingsForm = (initialValues = undefined) => {
  const [form] = Form.useForm();
  const [isEdited, setIsEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { reloadUser } = useAuth();
  const { message: antdMessage } = AntdApp.useApp();
  const handleApiError = useApiErrorHandler();

  const onValuesChange = useCallback(() => {
    setIsEdited(true);
  }, []);

  const resetForm = useCallback(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
    setIsEdited(false);
  }, [initialValues, form]);

  const handleSubmit = useCallback(async (successMessage = 'Updated saved!') => {
    setIsSubmitting(true);

    try {
      const updatedUser = await updateCurrentUser(form.getFieldsValue());
      reloadUser(updatedUser);
      setIsEdited(false);
      antdMessage.success(successMessage);

    } catch (err) {
      const statusCode = err.response?.status;
      const errorType = err.response?.data.type;

      if (statusCode === 409) {
        if (errorType === 'EMAIL_EXISTS') {
          antdMessage.error('Email already registered', 5);
        }
      } else {
        handleApiError(err);
      }
    }

    setIsSubmitting(false);
  }, [antdMessage, form, handleApiError, reloadUser]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return {
    form,
    isEdited,
    isSubmitting,
    onValuesChange,
    resetForm,
    handleSubmit
  };
};

export default useSettingsForm;
