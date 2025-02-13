import useModal from 'antd/es/modal/useModal';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CherryEditor from '../../components/CherryEditor';
import useFeedbackModal from '../../components/CherryEditor/useFeedbackModal';
import Error from '../../components/Error';
import useAxios from '../../hooks/useAxios';
import useFetch from '../../hooks/useFetch';
import { parseJSON } from '../../utils/jsonUtil';

const localStorageKeyPrefix = 'edit-';

function EditBlogPage() {
  const { blogId } = useParams();
  const { data: blog, loading, error } = useFetch(`/users/me/blogs/${blogId}`);
  const axios = useAxios();
  const navigate = useNavigate();

  // whether to use local draft or not
  const [usesLocalDraft, setUsesLocalDraft] = useState(false);
  // whether the load source (localStorage or database) of the blog is confirmed
  const [loadSourceConfirmed, setLoadSourceConfirmed] = useState(false);

  const [showFeedbackModal, FeedbackModal] = useFeedbackModal();
  const [confirmLoadSourceModal, confirmLocalDraftModalContext] = useModal();

  const localStorageKey = localStorageKeyPrefix + blogId;
  const localDraft = useRef(parseJSON(localStorage.getItem(localStorageKey)));

  useEffect(() => {
    if (localStorage.getItem(localStorageKey)) {
      confirmLoadSourceModal.confirm({
        title: 'Unsaved draft found',
        content: 'You have an unsaved draft of this blog. Do you want to continue editing?',
        okText: 'Continue',
        cancelText: 'Discard',
        cancelButtonProps: {
          danger: true
        },
        onOk: () => setUsesLocalDraft(true),
        afterClose: () => setLoadSourceConfirmed(true)
      });
    } else {
      setLoadSourceConfirmed(true);
    }
  }, [confirmLoadSourceModal, localStorageKey]);

  const handleSubmit = async (blogData, successMessage) => {
    // blogData.status: the new blog status to be set
    try {
      await axios.put(`/blogs/${blogId}`, blogData);
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
          initialTitle={(usesLocalDraft ? localDraft.current?.title : blog?.title) || ''}
          initialContent={(usesLocalDraft ? localDraft.current?.content : blog?.content) || ''}
          loading={loading}
          buttonPropsList={blog?.status === 'public' ? publicButtons : draftButtons}
          localStorageKey={localStorageKey}
          loadSourceConfirmed={loadSourceConfirmed}
        />
        <FeedbackModal onSuccess={() => navigate('/my-blogs')} />
        {confirmLocalDraftModalContext}
      </>
  );
}

export default EditBlogPage;
