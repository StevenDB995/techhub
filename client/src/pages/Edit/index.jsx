import { useNavigate, useParams } from 'react-router-dom';
import { getBlogById, updateBlogById } from '../../api/services/blogService';
import CherryEditor from '../../components/CherryEditor';
import useFeedbackModal from '../../components/CherryEditor/useFeedbackModal';
import Error from '../../components/Error';
import useFetch from '../../hooks/useFetch';
import routes from '../../routes';
import { extractMetaData } from '../../utils/mdUtil';

function Edit() {
  const { blogId } = useParams();
  const { data: blog, loading, error } = useFetch(getBlogById, blogId);
  const [showFeedbackModal, FeedbackModal] = useFeedbackModal();
  const navigate = useNavigate();

  const handleSubmit = async (inputValue, html, status, successMessage) => {
    // status: the new blog status to be set
    try {
      const { title, previewText } = extractMetaData(html);
      const response = await updateBlogById(blogId, {
        title,
        previewText,
        content: inputValue,
        status,
        createdAt: (blog.status === 'draft' && status === 'public') ? Date.now() : undefined
      });
      const resBody = response.data;
      const message = resBody.success ? successMessage : 'Error saving changes';
      showFeedbackModal(resBody.success, message);
    } catch (err) {
      showFeedbackModal(false, err.message);
    }
  };

  const handleSave = async (inputValue, html) => {
    await handleSubmit(inputValue, html, 'public', 'All update saved!');
  };

  const handleSaveAsDraft = async (inputValue, html) => {
    await handleSubmit(inputValue, html, 'draft', 'Draft saved!');
  };

  const handlePost = async (inputValue, html) => {
    await handleSubmit(inputValue, html, 'public', 'Blog published successfully!');
  };

  const isDisabled = inputValue => (inputValue.trim() === '' || blog && (inputValue === blog.content));

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
          value={blog ? blog.content : ''}
          loading={loading}
          buttonPropsList={blog && blog.status === 'public' ? publicButtons : draftButtons}
        />
        <FeedbackModal onSuccess={() => navigate(routes.home)} />
      </>
  );
}

export default Edit;
