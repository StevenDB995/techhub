import { Button, Modal, Result } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBlogById, updateBlogById } from '../../api/services/blogService';
import CherryEditor from '../../components/CherryEditor';
import Loading from '../../components/CherryEditor/Loading';
import Error from '../../components/Error';
import useFetch from '../../hooks/useFetch';
import route from '../../route';
import { extractMetaData } from '../../utils/mdUtil';

function Edit() {
  const { blogId } = useParams();
  const [inputValue, setInputValue] = useState('');
  const [html, setHtml] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [success, setSuccess] = useState(null);
  const { data: blog, loading, error } = useFetch(() => getBlogById(blogId));

  const navigate = useNavigate();

  const handleInputChange = (text, html) => {
    setInputValue(text);
    setHtml(html);
  };

  const _handleSubmit = async (status, successMessage) => {
    // status: the new blog status to be set
    try {
      const { title, previewText } = extractMetaData(html);
      const response = await updateBlogById(blogId, {
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

  const handleSave = () => {
    void _handleSubmit('public', 'All update saved!');
  };

  const handleSaveAsDraft = () => {
    void _handleSubmit('draft', 'Draft saved!');
  };

  const handlePost = () => {
    void _handleSubmit('public', 'Blog published successfully!');
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
        </>)
  );
}

export default Edit;
