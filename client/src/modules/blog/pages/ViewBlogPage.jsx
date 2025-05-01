import { deleteBlog } from '@/api/services/blogService';
import Error from '@/components/Error';
import Loading from '@/components/Loading';
import useApiErrorHandler from '@/hooks/useApiErrorHandler';
import useAuth from '@/hooks/useAuth';
import useConfirm from '@/hooks/useConfirm';
import useFetch from '@/hooks/useFetch';
import BlogHeader from '@/modules/blog/components/BlogHeader';
import loadable from '@loadable/component';
import { App as AntdApp, Divider, Modal } from 'antd';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ViewBlogPage.module.css';

const CherryViewer = loadable(() => import('@/modules/blog/components/CherryViewer'), {
  fallback: <Loading fullscreen />
});

function ViewBlogPage() {
  const { user } = useAuth();
  const { blogId } = useParams();
  const { data: blog, loading, error } = useFetch(`/blogs/${blogId}`);
  const isMe = (blog && blog.author._id === user?._id);

  const [modal, modalContextHolder] = Modal.useModal();
  const { message: antdMessage } = AntdApp.useApp();
  const { confirmDanger } = useConfirm();
  const handleApiError = useApiErrorHandler();
  const navigate = useNavigate();

  const handleDelete = useCallback(async () => {
    if (!user || !blog) return;
    try {
      await deleteBlog(blogId);
      antdMessage.success('Blog post deleted.');
      localStorage.removeItem(`edit-${blogId}`);
      navigate(`/${user.username}/blogs?status=${blog.status}`);
    } catch (err) {
      handleApiError(err);
    }
  }, [blogId, antdMessage, handleApiError, navigate, user, blog]);

  const confirmDelete = useCallback(() => {
    confirmDanger(modal, {
      title: 'Confirm Delete',
      content: 'Do you want to delete this blog post?',
      okText: 'Delete',
      onOk: () => handleDelete()
    });
  }, [confirmDanger, handleDelete, modal]);

  return (
    error ?
      <Error error={error} /> :
      <>
        <BlogHeader blog={blog} editable={isMe} onDelete={confirmDelete} />
        <Divider className={styles.divider} />
        <CherryViewer value={blog?.content} loading={loading} />
        {modalContextHolder}
      </>
  );
}

export default ViewBlogPage;
