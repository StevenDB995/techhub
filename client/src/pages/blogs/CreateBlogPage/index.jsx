import { createBlog } from '@/api/services/blogService';
import CherryEditor from '@/components/CherryEditor';
import useApiErrorHandler from '@/hooks/useApiErrorHandler';
import useAuth from '@/hooks/useAuth';
import { App as AntdApp } from 'antd';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const localStorageKey = 'create';

function CreateBlogPage() {
  const handleApiError = useApiErrorHandler();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { message: antdMessage } = AntdApp.useApp();

  const submit = useCallback(async (blogData) => {
    try {
      const response = await createBlog(blogData);
      localStorage.removeItem(localStorageKey);
      if (blogData.status === 'draft') {
        antdMessage.success('Draft saved!');
      } else {
        antdMessage.success('Blog posted successfully!');
      }
      navigate(`/blogs/${response.data._id}`);

    } catch (err) {
      handleApiError(err);
    }
  }, [handleApiError, navigate, antdMessage]);


  return (
    <CherryEditor
      page="create"
      username={user?.username}
      localStorageKey={localStorageKey}
      submitCallback={submit}
    />
  );
}

export default CreateBlogPage;
