import { Select } from 'antd';
import { useEffect, useState } from 'react';
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
  const { data, setData, loading, error, refetch } = useFetch(url);
  const [blogStatus, setBlogStatus] = useState(initialStatus);
  const [isBlogStatusChanged, setIsBlogStatusChanged] = useState(false);

  useEffect(() => {
    if (isBlogStatusChanged) {
      void refetch({
        params: { status: blogStatus }
      });
    }
  }, [blogStatus, isBlogStatusChanged, refetch]);

  const onChange = (value) => {
    setBlogStatus(value);
    if (!isBlogStatusChanged) {
      setIsBlogStatusChanged(true);
    }
  };

  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      <>
        <div className={styles.selectContainer}>
          <Select className={styles.select} defaultValue={initialStatus} options={options} onChange={onChange} />
        </div>
        <BlogList data={data} setData={setData} loading={loading} />
      </>
  );
}

export default Blogs;
