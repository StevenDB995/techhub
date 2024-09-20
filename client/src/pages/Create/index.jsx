import { Button, Modal, Result } from 'antd';
import useModal from 'antd/es/modal/useModal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../../api/services/blogService';
import CherryEditor from '../../components/CherryEditor';
import routes from '../../routes';
import { extractMetaData } from '../../utils/mdUtil';

const markdownTemplate = `# Title
## Heading 2
Paragraph here
### Heading 3
If you know, you know ;)`;

function Create() {
  const [inputValue, setInputValue] = useState('');
  const [html, setHtml] = useState('');

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [success, setSuccess] = useState(null);

  const [cancelModal, cancelModalContext] = useModal();

  const navigate = useNavigate();

  const handleInputChange = (text, html) => {
    setInputValue(text);
    setHtml(html);
  };

  const handleSubmit = async (status, successMessage) => {
    // status: the new blog status to be set
    try {
      const { title, previewText } = extractMetaData(html);
      const response = await createBlog({
        title,
        previewText,
        content: inputValue,
        status
      });
      const responseBody = response.data;
      setSuccess(responseBody.success);
      setFeedbackMessage(responseBody.success ? successMessage : 'Error saving changes');
    } catch (err) {
      setSuccess(false);
      setFeedbackMessage(err.message);
    }
    setFeedbackModalOpen(true);
  };

  const handlePost = () => {
    void handleSubmit('public', 'Blog published successfully!');
  };

  const handleSaveAsDraft = () => {
    void handleSubmit('draft', 'Draft saved!');
  };

  const handleCancel = () => {
    cancelModal.confirm({
      title: 'Quit Editing',
      content: 'Your current progress will be lost. Are you sure?',
      centered: true,
      okText: 'Keep Editing',
      cancelText: 'Quit',
      cancelButtonProps: {
        type: 'primary',
        danger: true
      },
      onCancel: () => navigate(routes.home)
    });
  };

  const handleFeedbackModalClose = () => {
    if (success) {
      navigate(routes.home);
    } else {
      setFeedbackModalOpen(false);
    }
  };

  const buttons = [
    <Button key="cancel" size="large" danger onClick={handleCancel}>Cancel</Button>,
    <Button key="draft" size="large" onClick={handleSaveAsDraft}>Save as Draft</Button>,
    <Button
      key="post" type="primary" size="large"
      onClick={handlePost}
      disabled={inputValue.trim() === ''}
    >
      Post
    </Button>
  ];

  return (
    <>
      <CherryEditor
        value={markdownTemplate}
        onChange={handleInputChange}
        buttons={buttons}
      />
      <Modal
        open={feedbackModalOpen}
        closable={false}
        centered={true}
        footer={[
          <Button key="ok" type="primary" onClick={handleFeedbackModalClose}>OK</Button>
        ]}
      >
        <Result status={success ? 'success' : 'error'} title={feedbackMessage} />
      </Modal>
      {cancelModalContext}
    </>
  );
}

export default Create;
