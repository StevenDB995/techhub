import { useNavigate } from 'react-router-dom';
import CherryEditor from '../../components/CherryEditor';
import useFeedbackModal from '../../components/CherryEditor/useFeedbackModal';
import useAxios from '../../hooks/useAxios';
import routes from '../../routes';

const markdownTemplate = `# Heading 1
## Heading 2
Paragraph here
### Heading 3
If you know, you know ;)`;

function Create() {
  const axios = useAxios();
  const [showFeedbackModal, FeedbackModal] = useFeedbackModal();
  const navigate = useNavigate();

  const handleSubmit = async (blogData, successMessage) => {
    // blogData.status: the new blog status to be set
    try {
      await axios.post('/blogs', blogData);
      showFeedbackModal(true, successMessage);
    } catch (err) {
      showFeedbackModal(false, err.message);
    }
  };

  const handlePost = async (blogData) => {
    blogData.status = 'public';
    await handleSubmit(blogData, 'Blog published successfully!');
  };

  const handleSaveAsDraft = async (blogData) => {
    blogData.status = 'draft';
    await handleSubmit(blogData, 'Draft saved!');
  };

  const buttonPropsList = [
    {
      text: 'Save As Draft',
      onSubmit: handleSaveAsDraft
    },
    {
      text: 'Post',
      type: 'primary',
      onSubmit: handlePost,
      isDisabled: (_, content) => content.trim() === ''
    }
  ];

  return (
    <>
      <CherryEditor
        initialContent={markdownTemplate}
        buttonPropsList={buttonPropsList}
      />
      <FeedbackModal onSuccess={() => navigate(routes.home)} />
    </>
  );
}

export default Create;
