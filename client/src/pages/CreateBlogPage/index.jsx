import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CherryEditor from '../../components/CherryEditor';
import useFeedbackModal from '../../components/CherryEditor/useFeedbackModal';
import useApi from '../../hooks/useApi';
import { parseJSON } from '../../utils/jsonUtil';

const markdownTemplate = `# Heading 1
## Heading 2
Paragraph here
### Heading 3
If you know, you know ;)`;

const localStorageKey = 'create';

function CreateBlogPage() {
  const api = useApi();
  const [showFeedbackModal, FeedbackModal] = useFeedbackModal();
  const navigate = useNavigate();

  const localDraft = useRef(parseJSON(localStorage.getItem(localStorageKey)));

  const handleSubmit = async (blogData, successMessage) => {
    // blogData.status: the new blog status to be set
    try {
      await api.post('/blogs', blogData);
      showFeedbackModal(true, successMessage);
      localStorage.removeItem(localStorageKey);
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
        initialTitle={localDraft.current?.title || ''}
        initialContent={localDraft.current?.content || markdownTemplate}
        buttonPropsList={buttonPropsList}
        localStorageKey={localStorageKey}
      />
      <FeedbackModal onSuccess={() => navigate('/my-blogs')} />
    </>
  );
}

export default CreateBlogPage;
