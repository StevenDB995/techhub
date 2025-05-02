import { createBlog } from '@/api/services/blogService';
import Loading from '@/components/Loading';
import useApiErrorHandler from '@/hooks/useApiErrorHandler';
import useAuth from '@/hooks/useAuth';
import loadable from '@loadable/component';
import { App as AntdApp } from 'antd';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const CherryEditor = loadable(() => import('@/modules/blog/components/CherryEditor'), {
  fallback: <Loading fullscreen />
});

const localStorageKey = 'create';

function CreateBlogPage() {
  const handleApiError = useApiErrorHandler();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { message: antdMessage } = AntdApp.useApp();

  const submit = useCallback(async (blogData) => {
    try {
      await createBlog(blogData);
      localStorage.removeItem(localStorageKey);
      if (blogData.status === 'draft') {
        antdMessage.success('Draft saved!');
      } else {
        antdMessage.success('Blog posted successfully!');
      }
      navigate(`/${user?.username}/blogs?status=${blogData.status}`);

    } catch (err) {
      handleApiError(err);
    }
  }, [user, navigate, antdMessage, handleApiError]);


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
