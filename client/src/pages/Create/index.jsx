import { Button, Modal, Result } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Blog from '../../api/services/Blog';
import CherryEditor from '../../components/CherryEditor';
import route from '../../route';

const markdownTemplate = `# Title
## Heading 2
Paragraph here
### Heading 3
If you know, you know ;)`;

function Create() {
  const [inputValue, setInputValue] = useState(markdownTemplate);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const handlePost = async () => {
    const response = await Blog.createBlog({ content: inputValue });
    const responseBody = response.data;
    setIsModalOpen(true);
    setSuccess(responseBody.success);
  };

  const handleSaveAsDraft = () => {
    // TODO: implement handleSaveAsDraft
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
    <Button key="cancel" type="default" size="large" danger onClick={handleCancel}>Cancel</Button>,
    <Button key="draft" type="default" size="large" onClick={handleSaveAsDraft}>Save as Draft</Button>,
    <Button key="post" type="primary" size="large" onClick={handlePost}>Post</Button>
  ];

  return (
    <>
      <CherryEditor
        value={inputValue}
        onChange={handleInputChange}
        buttons={buttons}
        buttonGap="small"
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
        {success ?
          <Result
            status="success"
            title="Blog posted successfully!"
          /> :
          <Result
            status="error"
            title="Unexpected error"
          />}
      </Modal>
    </>
  );
}

export default Create;
