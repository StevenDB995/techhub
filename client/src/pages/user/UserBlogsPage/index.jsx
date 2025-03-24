import { Modal, Select } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { deleteBlog } from '../../../api/services/blogService';
import BlogList from '../../../components/BlogList';
import Error from '../../../components/Error';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';
import useAuth from '../../../hooks/useAuth';
import useConfirm from '../../../hooks/useConfirm';
import useFeedback from '../../../hooks/useFeedback';
import useFetch from '../../../hooks/useFetch';
import styles from './UserBlogsPage.module.css';

const selectOptions = [
  {
    label: 'Public',
    value: 'public'
  },
  {
    label: 'Drafts',
    value: 'draft'
  }
];

function UserBlogsPage() {
  const { user } = useAuth();
  const { username } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [blogStatus, setBlogStatus] = useState(searchParams.get('status'));
  const url = `/users/${username}/blogs`;
  const params = useMemo(() => ({ status: blogStatus }), [blogStatus]);
  const { data, loading, error } = useFetch(url, params);
  const [blogs, setBlogs] = useState([]);

  const handleApiError = useApiErrorHandler();
  const [modal, modalContextHolder] = Modal.useModal();
  const { confirmDanger } = useConfirm();
  const { feedbackByModal } = useFeedback();

  // case-insensitive username
  const isMe = username.toLowerCase() === user?.username.toLowerCase();

  const onChange = (value) => {
    setBlogStatus(value);
    setSearchParams({ status: value });
  };

  useEffect(() => {
    if (data) setBlogs(data);
  }, [data]);

  const feedbackDelete = useCallback((success) => {
    feedbackByModal(modal, success, success && 'Blog post deleted.');
  }, [feedbackByModal, modal]);

  const handleDelete = useCallback(async (blogId) => {
    try {
      await deleteBlog(blogId);
      feedbackDelete(true);
      setBlogs(blogs.filter(blog => blog._id !== blogId));
      localStorage.removeItem(`edit-${blogId}`);
    } catch (err) {
      handleApiError(err, () => {
        feedbackDelete(false);
      });
    }
  }, [handleApiError, blogs, feedbackDelete]);

  const confirmDelete = useCallback((blogId) => {
    confirmDanger(modal, {
      title: 'Confirm Delete',
      content: 'Do you want to delete this blog post?',
      okText: 'Delete',
      onOk: () => handleDelete(blogId)
    });
  }, [confirmDanger, modal, handleDelete]);

  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      <>
        {isMe && <div className={styles.selectContainer}>
          <Select
            className={styles.select}
            value={blogStatus || 'public'}
            options={selectOptions}
            onChange={onChange}
          />
        </div>}
        <BlogList data={blogs} loading={loading} editable={isMe} onDelete={confirmDelete} />
        {modalContextHolder}
      </>
  );
}

export default UserBlogsPage;
