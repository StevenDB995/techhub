import { Button, Modal, Result } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBlogById, updateBlogById } from '../../api/services/blogService';
import CherryEditor from '../../components/CherryEditor';
import Loading from '../../components/CherryEditor/Loading';
import Error from '../../components/Error';
import useFetch from '../../hooks/useFetch';
import route from '../../route';
import { extractPreviewText, extractTitle } from '../../utils/mdUtil';

function Edit() {
  const { blogId } = useParams();
  const [inputValue, setInputValue] = useState('');
  const [html, setHtml] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const { data: blog, loading, error } = useFetch(() => getBlogById(blogId));

  const navigate = useNavigate();

  const handleInputChange = (text, html) => {
    setInputValue(text);
    setHtml(html);
  };

  const handleSave = async () => {
    const title = extractTitle(inputValue);
    const previewText = extractPreviewText(html);
    const response = await updateBlogById(blogId, { title, previewText, content: inputValue });
    const responseBody = response.data;
    setIsModalOpen(true);
    setSuccess(responseBody.success);
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
    <Button
      key="save" type="primary" size="large"
      onClick={handleSave}
      // cannot save if the content is empty or unchanged
      disabled={inputValue.trim() === '' || inputValue === blog.content}
    >
      Save
    </Button>
  ];

  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      (loading ? <Loading /> :
        <>
          <CherryEditor
            value={blog.content}
            onChange={handleInputChange}
            buttons={buttons}
            buttonGap="middle"
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
                title="Blog updated successfully!"
              /> :
              <Result
                status="error"
                title="Error updating blog"
              />}
          </Modal>
        </>)
  );
}

export default Edit;