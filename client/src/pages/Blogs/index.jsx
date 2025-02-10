import { Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import BlogList from '../../components/BlogList';
import Error from '../../components/Error';
import useFetch from '../../hooks/useFetch';
import styles from './Blogs.module.css';

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

const url = '/users/me/blogs';
const initialStatus = 'public';

function Blogs() {
  const { data, loading, error, refetch } = useFetch(url);
  const [blogStatus, setBlogStatus] = useState(initialStatus);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isFirstRender.current) {
      void refetch({
        params: { status: blogStatus }
      });
    }
  }, [blogStatus, refetch]);

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
          <Select className={styles.select} defaultValue={initialStatus} options={options} onChange={onChange} />
        </div>
        <BlogList data={data} loading={loading} isPublic={false} />
      </>
  );
}

export default Blogs;
