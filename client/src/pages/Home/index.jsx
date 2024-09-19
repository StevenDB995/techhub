import { getAllBlogs } from '../../api/services/blogService';
import BlogList from '../../components/BlogList';
import Error from '../../components/Error';
import useFetch from '../../hooks/useFetch';

function Home() {
  const { data, loading, error } = useFetch(getAllBlogs);
  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      <BlogList data={data} loading={loading} />
  );
}

export default Home;
