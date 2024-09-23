import { useNavigate } from 'react-router-dom';
import { createBlog } from '../../api/services/blogService';
import CherryEditor from '../../components/CherryEditor';
import useFeedbackModal from '../../components/CherryEditor/useFeedbackModal';
import routes from '../../routes';
import { extractMetaData } from '../../utils/mdUtil';

const markdownTemplate = `# Title
## Heading 2
Paragraph here
### Heading 3
If you know, you know ;)`;

function Create() {
  const [showFeedbackModal, FeedbackModal] = useFeedbackModal();
  const navigate = useNavigate();

  const handleSubmit = async (inputValue, html, status, successMessage) => {
    // status: the new blog status to be set
    try {
      const { title, previewText } = extractMetaData(html);
      await createBlog({
        title,
        previewText,
        content: inputValue,
        status
      });
      showFeedbackModal(true, successMessage);
    } catch (err) {
      showFeedbackModal(false, err.message);
    }
  };

  const handlePost = async (inputValue, html) => {
    await handleSubmit(inputValue, html, 'public', 'Blog published successfully!');
  };

  const handleSaveAsDraft = async (inputValue, html) => {
    await handleSubmit(inputValue, html, 'draft', 'Draft saved!');
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
      isDisabled: inputValue => inputValue.trim() === ''
    }
  ];

  return (
    <>
      <CherryEditor
        value={markdownTemplate}
        buttonPropsList={buttonPropsList}
      />
      <FeedbackModal onSuccess={() => navigate(routes.home)} />
    </>
  );
}

export default Create;
