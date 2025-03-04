import { Select } from 'antd';
import { useMemo, useState } from 'react';
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
  const { user } = useAuth();
  const { username } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [blogStatus, setBlogStatus] = useState(searchParams.get('status'));
  const url = `/users/${username}/blogs`;
  const params = useMemo(() => ({ status: blogStatus }), [blogStatus]);
  const { data, loading, error } = useFetch(url, params);

  const isMe = username === user?.username;

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
        <BlogList data={data} loading={loading} showActions={isMe} />
      </>
  );
}

export default UserBlogsPage;
