import { Modal, Select } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import BlogList from '../../components/BlogList';
import Error from '../../components/Error';
import useApi from '../../hooks/useApi';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
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
  const { api, apiErrorHandler } = useApi();
  const { username } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [blogStatus, setBlogStatus] = useState(searchParams.get('status'));
  const url = `/users/${username}/blogs`;
  const params = useMemo(() => ({ status: blogStatus }), [blogStatus]);

  const { data, loading, error } = useFetch(url, params);
  const [blogs, setBlogs] = useState([]);
  const [modal, modalContextHolder] = Modal.useModal();

  // case-insensitive username
  const isMe = username.toLowerCase() === user?.username.toLowerCase();

  const onChange = (value) => {
    setBlogStatus(value);
    setSearchParams({ status: value });
  };

  useEffect(() => {
    if (data) setBlogs(data);
  }, [data]);

  const feedbackDelete = useCallback((success, errorMessage = undefined) => {
    if (success) {
      modal.success({
        title: 'Success',
        content: 'Blog deleted',
        cancelButtonProps: { style: { display: 'none' } }
      });
    } else {
      modal.error({
        title: 'Error',
        content: errorMessage || 'Error deleting blog',
        cancelButtonProps: { style: { display: 'none' } }
      });
    }
  }, [modal]);

  const handleDelete = useCallback(async (blogId) => {
    try {
      await api.delete(`/blogs/${blogId}`);
      feedbackDelete(true);
      setBlogs(blogs.filter(blog => blog._id !== blogId));
      localStorage.removeItem(`edit-${blogId}`);
    } catch (err) {
      apiErrorHandler(err, () => {
        feedbackDelete(false, err.message);
      });
    }
  }, [api, apiErrorHandler, blogs, feedbackDelete]);

  const confirmDelete = useCallback((blogId) => {
    modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure?',
      okText: 'Delete',
      okButtonProps: {
        danger: true
      },
      autoFocusButton: null,
      onOk: () => handleDelete(blogId)
    });
  }, [modal, handleDelete]);

  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      <>
        {isMe && <div className={styles.selectContainer}>
          <Select className={styles.select} value={blogStatus || 'public'} options={selectOptions} onChange={onChange} />
        </div>}
        <BlogList data={blogs} loading={loading} showActions={isMe} onDelete={confirmDelete} />
        {modalContextHolder}
      </>
  );
}

export default UserBlogsPage;
