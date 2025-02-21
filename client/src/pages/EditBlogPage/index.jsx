import { Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CherryEditor from '../../components/CherryEditor';
import useFeedbackModal from '../../components/CherryEditor/useFeedbackModal';
import Error from '../../components/Error';
import useApi from '../../hooks/useApi';
import useFetch from '../../hooks/useFetch';
import { parseJSON } from '../../utils/jsonUtil';

const localStorageKeyPrefix = 'edit-';

function EditBlogPage() {
  const { blogId } = useParams();
  const { data: blog, loading, error } = useFetch(`/users/me/blogs/${blogId}`);
  const api = useApi();
  const navigate = useNavigate();

  const localStorageKey = localStorageKeyPrefix + blogId;
  const localDraft = useRef(parseJSON(localStorage.getItem(localStorageKey)));

  // whether to use local draft or not
  const [useLocalDraft, setUseLocalDraft] = useState(!!localStorage.getItem(localStorageKey));
  // whether the load source (localStorage or database) of the blog is confirmed
  const [loadSourceConfirmed, setLoadSourceConfirmed] = useState(false);

  const [modal, modalContextHolder] = Modal.useModal();
  const [showFeedbackModal, FeedbackModal] = useFeedbackModal();

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
    return () => {
      const currentDraft = parseJSON(localStorage.getItem(localStorageKey));
      if (currentDraft?.title === blog?.title && currentDraft?.content === blog?.content) {
        localStorage.removeItem(localStorageKey);
      }
    };
  }, [blog, localStorageKey]);

  const handleSubmit = async (blogData, successMessage) => {
    // blogData.status: the new blog status to be set
    try {
      await api.put(`/blogs/${blogId}`, blogData);
      showFeedbackModal(true, successMessage);
      localStorage.removeItem(localStorageKey);
    } catch (err) {
      showFeedbackModal(false, err.message);
    }
  };

  const handleSave = async (blogData) => {
    blogData.status = 'public';
    await handleSubmit(blogData, 'All update saved!');
  };

  const handleSaveAsDraft = async (blogData) => {
    blogData.status = 'draft';
    await handleSubmit(blogData, 'Draft saved!');
  };

  const handlePost = async (blogData) => {
    blogData.status = 'public';
    await handleSubmit(blogData, 'Blog published successfully!');
  };

  const isDisabled = (title, content) => (
    !blog ||
    content.trim() === '' ||
    content === blog.content && title === blog.title
  );

  const publicButtons = [
    {
      text: 'Save',
      type: 'primary',
      onSubmit: handleSave,
      isDisabled: isDisabled
    }
  ];

  const draftButtons = [
    {
      text: 'Save As Draft',
      onSubmit: handleSaveAsDraft,
      isDisabled: isDisabled
    },
    {
      text: 'Post',
      type: 'primary',
      onSubmit: handlePost
    }
  ];

  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      <>
        <CherryEditor
          initialTitle={(useLocalDraft ? localDraft.current?.title : blog?.title) || ''}
          initialContent={(useLocalDraft ? localDraft.current?.content : blog?.content) || ''}
          loading={loading}
          buttonPropsList={blog?.status === 'public' ? publicButtons : draftButtons}
          localStorageKey={localStorageKey}
          loadSourceConfirmed={loadSourceConfirmed}
        />
        <FeedbackModal onSuccess={() => navigate('/my-blogs')} />
        {modalContextHolder}
      </>
  );
}

export default EditBlogPage;
