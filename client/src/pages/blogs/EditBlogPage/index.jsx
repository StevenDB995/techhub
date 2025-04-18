import { updateBlog } from '@/api/services/blogService';
import CherryEditor from '@/components/CherryEditor';
import Error from '@/components/Error';
import useApiErrorHandler from '@/hooks/useApiErrorHandler';
import useFetch from '@/hooks/useFetch';
import { parseJSON } from '@/utils/jsonUtil';
import { App as AntdApp, Modal } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const localStorageKeyPrefix = 'edit-';

function EditBlogPage() {
  const { blogId } = useParams();
  const { data: blog, loading, error } = useFetch(`/blogs/${blogId}`);
  const handleApiError = useApiErrorHandler();
  const navigate = useNavigate();
  const { message: antdMessage } = AntdApp.useApp();
  const [modal, modalContextHolder] = Modal.useModal();

  const localStorageKey = localStorageKeyPrefix + blogId;
  // whether to use local draft or not
  const [useLocalDraft, setUseLocalDraft] = useState(!!localStorage.getItem(localStorageKey));
  // whether the load source (localStorage or database) of the blog is confirmed
  const [loadSourceConfirmed, setLoadSourceConfirmed] = useState(false);


  useEffect(() => {
    if (localStorage.getItem(localStorageKey)) {
      modal.confirm({
        title: 'Unsaved draft found',
        content: 'You have an unsaved draft of this blog. Do you want to continue editing?',
        okText: 'Continue',
        cancelText: 'Discard',
        cancelButtonProps: {
          danger: true
        },
        onOk: () => setUseLocalDraft(true),
        onCancel: () => setUseLocalDraft(false),
        afterClose: () => setLoadSourceConfirmed(true)
      });
    } else {
      setLoadSourceConfirmed(true);
    }
  }, [modal, localStorageKey]);

  // A cleanup effect:
  // When the edit page is closed, if the edited blog remain the same as when it was loaded,
  // the draft in the local storage will be removed.
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (localStorage.getItem(localStorageKey)) {
        const currentDraft = parseJSON(localStorage.getItem(localStorageKey));
        if (currentDraft?.title === blog?.title && currentDraft?.content === blog?.content) {
          localStorage.removeItem(localStorageKey);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [blog, localStorageKey]);

  const submit = useCallback(async (blogData) => {
    try {
      await updateBlog(blogId, blogData);
      localStorage.removeItem(localStorageKey);
      if (blogData.status === 'draft') {
        antdMessage.success('Draft saved!');
      } else {
        antdMessage.success('Blog saved!');
      }
      navigate(`/blogs/${blogId}`);

    } catch (err) {
      handleApiError(err);
    }
  }, [handleApiError, blogId, localStorageKey, navigate, antdMessage]);

  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      <>
        <CherryEditor
          page="edit"
          blog={blog}
          loading={loading}
          localStorageKey={localStorageKey}
          useLocalDraft={useLocalDraft}
          loadSourceConfirmed={loadSourceConfirmed}
          submitCallback={submit}
        />
        {modalContextHolder}
      </>
  );
}

export default EditBlogPage;
