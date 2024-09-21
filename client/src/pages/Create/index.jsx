import { useNavigate } from 'react-router-dom';
import { createBlog } from '../../api/services/blogService';
import CherryEditor from '../../components/CherryEditor';
import useFeedbackModal from '../../hooks/modals/useFeedbackModal';
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
      const response = await createBlog({
        title,
        previewText,
        content: inputValue,
        status
      });
      const resBody = response.data;
      const message = resBody.success ? successMessage : 'Error saving changes';
      showFeedbackModal(resBody.success, message);
    } catch (err) {
      showFeedbackModal(false, err.message);
    }
  };

  const handlePost = (inputValue, html) => {
    void handleSubmit(inputValue, html, 'public', 'Blog published successfully!');
  };

  const handleSaveAsDraft = (inputValue, html) => {
    void handleSubmit(inputValue, html, 'draft', 'Draft saved!');
  };

  const buttonPropsList = [
    {
      text: 'Save As Draft',
      submitCallback: handleSaveAsDraft
    },
    {
      text: 'Post',
      type: 'primary',
      submitCallback: handlePost,
      isDisabledCallback: inputValue => inputValue.trim() === ''
    }
  ];

  return (
    <>
      <CherryEditor
        value={markdownTemplate}
        buttonPropsList={buttonPropsList}
      />
      <FeedbackModal successCallback={() => navigate(routes.home)} />
    </>
  );
}

export default Create;
