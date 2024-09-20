import { Button, Modal, Result } from 'antd';
import useModal from 'antd/es/modal/useModal';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBlogById, updateBlogById } from '../../api/services/blogService';
import CherryEditor from '../../components/CherryEditor';
import Loading from '../../components/CherryEditor/Loading';
import Error from '../../components/Error';
import useFetch from '../../hooks/useFetch';
import routes from '../../routes';
import { extractMetaData } from '../../utils/mdUtil';

function Edit() {
  const { blogId } = useParams();
  const { data: blog, loading, error } = useFetch(getBlogById, blogId);

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
      const response = await updateBlogById(blogId, {
        title,
        previewText,
        content: inputValue,
        status,
        createdAt: (blog.status === 'draft' && status === 'public') ? Date.now() : undefined
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

  const handleSave = () => {
    void handleSubmit('public', 'All update saved!');
  };

  const handleSaveAsDraft = () => {
    void handleSubmit('draft', 'Draft saved!');
  };

  const handlePost = () => {
    void handleSubmit('public', 'Blog published successfully!');
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

  const handleModalClose = () => {
    if (success) {
      navigate(routes.home);
    } else {
      setFeedbackModalOpen(false);
    }
  };

  const publicButtons = [
    <Button key="cancel" size="large" danger onClick={handleCancel}>Cancel</Button>,
    <Button
      key="save" type="primary" size="large"
      onClick={handleSave}
      // cannot save if the content is empty or unchanged
      disabled={inputValue.trim() === '' || inputValue === blog.content}
    >
      Save
    </Button>
  ];

  const draftButtons = [
    <Button key="cancel" size="large" danger onClick={handleCancel}>Cancel</Button>,
    <Button
      key="saveAsDraft" size="large"
      onClick={handleSaveAsDraft}
      // cannot save if the content is empty or unchanged
      disabled={inputValue.trim() === '' || inputValue === blog.content}
    >
      Save As Draft
    </Button>,
    <Button key="post" type="primary" size="large" onClick={handlePost}>Post</Button>
  ];

  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      (loading ? <Loading /> :
        <>
          <CherryEditor
            value={blog.content}
            onChange={handleInputChange}
            buttons={blog.status === 'public' ? publicButtons : draftButtons}
          />
          <Modal
            open={feedbackModalOpen}
            afterClose={handleModalClose}
            closable={false}
            centered={true}
            footer={[
              <Button key="ok" type="primary" onClick={handleModalClose}>OK</Button>
            ]}
          >
            <Result status={success ? 'success' : 'error'} title={feedbackMessage} />
          </Modal>
          {cancelModalContext}
        </>)
  );
}

export default Edit;
