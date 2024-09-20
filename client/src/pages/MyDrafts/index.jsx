import { getBlogsByStatus } from '../../api/services/blogService';
import BlogList from '../../components/BlogList';
import Error from '../../components/Error';
import useFetch from '../../hooks/useFetch';

function MyDrafts() {
  const { data, loading, error } = useFetch(getBlogsByStatus, { status: 'draft' });
  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      <BlogList data={data} loading={loading} />
  );
}

export default MyDrafts;
