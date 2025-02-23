import { Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BlogList from '../../components/BlogList';
import Error from '../../components/Error';
import useFetch from '../../hooks/useFetch';
import styles from './MyBlogsPage.module.css';

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

function MyBlogsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogStatus, setBlogStatus] = useState(searchParams.get('status') || 'public');
  const { data, loading, error, refetch } = useFetch('/users/me/blogs', {
    params: { status: blogStatus }
  });
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isFirstRender.current) {
      setSearchParams({ status: blogStatus });
      void refetch({
        params: { status: blogStatus }
      });
    }
  }, [blogStatus, refetch, setSearchParams]);

  const onChange = (value) => {
    setBlogStatus(value);
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  };

  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      <>
        <div className={styles.selectContainer}>
          <Select className={styles.select} value={blogStatus} options={options} onChange={onChange} />
        </div>
        <BlogList data={data} loading={loading} isPublic={false} />
      </>
  );
}

export default MyBlogsPage;
