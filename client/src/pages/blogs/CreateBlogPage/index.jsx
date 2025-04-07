import { createBlog } from '@/api/services/blogService';
import CherryEditor from '@/components/CherryEditor';
import useFeedbackModal from '@/components/CherryEditor/useFeedbackModal';
import useApiErrorHandler from '@/hooks/useApiErrorHandler';
import { parseJSON } from '@/utils/jsonUtil';
import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const markdownTemplate = `# Heading 1
## Heading 2
Paragraph here
### Heading 3
If you know, you know ;)`;

const localStorageKey = 'create';

function CreateBlogPage() {
  const [showFeedbackModal, feedbackModal] = useFeedbackModal();
  const handleApiError = useApiErrorHandler();
  const navigate = useNavigate();
  const localDraft = useRef(parseJSON(localStorage.getItem(localStorageKey)));

  const handleSubmit = useCallback(async (blogData, successMessage) => {
    // blogData.status: the new blog status to be set
    try {
      const response = await createBlog(blogData);
      showFeedbackModal(true, successMessage, () => navigate(`/blogs/${response.data._id}`));
      localStorage.removeItem(localStorageKey);
    } catch (err) {
      showFeedbackModal(false, err.message, () => handleApiError(err));
    }
  }, [handleApiError, navigate, showFeedbackModal]);

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
      isDisabled: (title, content) => content.trim() === ''
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
      {feedbackModal}
    </>
  );
}

export default CreateBlogPage;
