import { Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import BlogList from '../../components/BlogList';
import Error from '../../components/Error';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import styles from './UserBlogsPage.module.css';

const options = [
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
  const { isAuthenticated, decodedJwt } = useAuth();
  const { username } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [blogStatus, setBlogStatus] = useState(searchParams.get('status'));
  const isMe = isAuthenticated && username === decodedJwt?.username;
  const url = isMe ? '/users/me/blogs' : `/users/${username}/blogs`;
  const config = useMemo(() => isMe ? {
    params: { status: blogStatus }
  } : undefined, [blogStatus, isMe]);
  const { data, loading, error } = useFetch(url, config);

  useEffect(() => {
    if (blogStatus) {
      setSearchParams({ status: blogStatus });
    }
  }, [blogStatus, setSearchParams]);

  const onChange = (value) => {
    setBlogStatus(value);
  };

  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      <>
        {isMe && <div className={styles.selectContainer}>
          <Select className={styles.select} value={blogStatus || 'public'} options={options} onChange={onChange} />
        </div>}
        <BlogList data={data} loading={loading} isPublic={false} />
      </>
  );
}

export default UserBlogsPage;
