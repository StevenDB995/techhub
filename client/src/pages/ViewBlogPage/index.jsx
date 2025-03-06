import { Divider, Modal } from 'antd';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteBlog } from '../../api/services/blogService';
import BlogHeader from '../../components/BlogHeader';
import CherryViewer from '../../components/CherryViewer';
import Error from '../../components/Error';
import Loading from '../../components/Loading';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import useAuth from '../../hooks/useAuth';
import useConfirm from '../../hooks/useConfirm';
import useFeedback from '../../hooks/useFeedback';
import useFetch from '../../hooks/useFetch';
import styles from './ViewBlogPage.module.css';

function ViewBlogPage() {
  const { user } = useAuth();
  const { blogId } = useParams();
  const { data: blog, loading, error } = useFetch(`/blogs/${blogId}`);
  const isMe = (blog && blog.author._id === user?._id);

  const [modal, modalContextHolder] = Modal.useModal();
  const { feedback } = useFeedback();
  const { confirmDanger } = useConfirm();
  const handleApiError = useApiErrorHandler();
  const navigate = useNavigate();

  const feedbackDelete = useCallback((success) => {
    feedback(modal, success, success && 'Blog post deleted.');
  }, [feedback, modal]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteBlog(blogId);
      feedbackDelete(true);
      localStorage.removeItem(`edit-${blogId}`);
      navigate(`/${user.username}/blogs?status=${blog.status}`);
    } catch (err) {
      handleApiError(err, () => {
        feedbackDelete(false);
      });
    }
  }, [blogId, feedbackDelete, handleApiError, navigate, user, blog]);

  const confirmDelete = useCallback(() => {
    confirmDanger(modal, {
      title: 'Confirm Delete',
      content: 'Do you want to delete this blog post?',
      okText: 'Delete',
      onOk: () => handleDelete()
    });
  }, [confirmDanger, handleDelete, modal]);

  if (loading) return <Loading />;

  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      <>
        <BlogHeader blog={blog} editable={isMe} onDelete={confirmDelete} />
        <Divider className={styles.divider} />
        <CherryViewer value={blog.content} />
        {modalContextHolder}
      </>
  );
}

export default ViewBlogPage;
