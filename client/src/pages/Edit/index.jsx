import { useNavigate, useParams } from 'react-router-dom';
import CherryEditor from '../../components/CherryEditor';
import useFeedbackModal from '../../components/CherryEditor/useFeedbackModal';
import Error from '../../components/Error';
import useAxios from '../../hooks/useAxios';
import useFetch from '../../hooks/useFetch';
import routes from '../../routes';

function Edit() {
  const { blogId } = useParams();
  const { data: blog, loading, error } = useFetch(`/users/me/blogs/${blogId}`);
  const axios = useAxios();
  const [showFeedbackModal, FeedbackModal] = useFeedbackModal();
  const navigate = useNavigate();

  const handleSubmit = async (blogData, successMessage) => {
    // blogData.status: the new blog status to be set
    try {
      await axios.put(`/blogs/${blogId}`, blogData);
      showFeedbackModal(true, successMessage);
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
    content.trim() === '' ||
    blog && (content === blog.content && title === blog.title)
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
          initialTitle={blog ? blog.title : ''}
          initialContent={blog ? blog.content : ''}
          loading={loading}
          buttonPropsList={blog && blog.status === 'public' ? publicButtons : draftButtons}
        />
        <FeedbackModal onSuccess={() => navigate(routes.home)} />
      </>
  );
}

export default Edit;
