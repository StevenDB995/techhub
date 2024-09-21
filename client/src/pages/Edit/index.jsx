import { useNavigate, useParams } from 'react-router-dom';
import { getBlogById, updateBlogById } from '../../api/services/blogService';
import CherryEditor from '../../components/CherryEditor';
import Loading from '../../components/CherryEditor/Loading';
import Error from '../../components/Error';
import useFeedbackModal from '../../hooks/useFeedbackModal';
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

  const handleSave = (inputValue, html) => {
    void handleSubmit(inputValue, html, 'public', 'All update saved!');
  };

  const handleSaveAsDraft = (inputValue, html) => {
    void handleSubmit(inputValue, html, 'draft', 'Draft saved!');
  };

  const handlePost = (inputValue, html) => {
    void handleSubmit(inputValue, html, 'public', 'Blog published successfully!');
  };

  const isDisabled = inputValue => (inputValue.trim() === '' || inputValue === blog.content);

  const publicButtons = [
    {
      text: 'Save',
      type: 'primary',
      submitCallback: handleSave,
      isDisabledCallback: isDisabled
    }
  ];

  const draftButtons = [
    {
      text: 'Save As Draft',
      submitCallback: handleSaveAsDraft,
      isDisabledCallback: isDisabled
    },
    {
      text: 'Post',
      type: 'primary',
      submitCallback: handlePost
    }
  ];

  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      (loading ? <Loading /> :
        <>
          <CherryEditor
            value={blog.content}
            buttonPropsList={blog.status === 'public' ? publicButtons : draftButtons}
          />
          <FeedbackModal successCallback={() => navigate(routes.home)} />
        </>)
  );
}

export default Edit;
