import { Button, Modal, Result } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../../api/services/blogService';
import CherryEditor from '../../components/CherryEditor';
import route from '../../route';
import { extractMetaData } from '../../utils/mdUtil';

const markdownTemplate = `# Title
## Heading 2
Paragraph here
### Heading 3
If you know, you know ;)`;

function Create() {
  const [inputValue, setInputValue] = useState('');
  const [html, setHtml] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (text, html) => {
    setInputValue(text);
    setHtml(html);
  };

  const _handleSubmit = async (status, successMessage) => {
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
      setModalMessage(responseBody.success ? successMessage : 'Error saving changes');
    } catch (err) {
      setSuccess(false);
      setModalMessage(err.message);
    }
    setIsModalOpen(true);
  };

  const handlePost = () => {
    void _handleSubmit('public', 'Blog published successfully!');
  };

  const handleSaveAsDraft = () => {
    void _handleSubmit('draft', 'Draft saved!');
  };

  const handleCancel = () => {
    // TODO: implement handleCancel
  };

  const handleModalClose = () => {
    if (success) {
      navigate(route.home);
    } else {
      setIsModalOpen(false);
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
        open={isModalOpen}
        afterClose={handleModalClose}
        closable={false}
        centered={true}
        footer={[
          <Button key="ok" type="primary" onClick={handleModalClose}>OK</Button>
        ]}
      >
        <Result status={success ? 'success' : 'error'} title={modalMessage} />
      </Modal>
    </>
  );
}

export default Create;
