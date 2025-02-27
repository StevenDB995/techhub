import { Select } from 'antd';
import { useState } from 'react';
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
  const url = `/users/${username}/blogs`;
  const { data, loading, error } = useFetch(url, { params: { status: blogStatus } });

  const isMe = isAuthenticated && username === decodedJwt?.username;

  const onChange = (value) => {
    setBlogStatus(value);
    setSearchParams({ status: value });
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
