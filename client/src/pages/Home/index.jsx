import { getPublicBlogs } from '../../api/services/blogService';
import BlogList from '../../components/BlogList';
import Error from '../../components/Error';
import useFetch from '../../hooks/useFetch';

function Home() {
  const { data, setData, loading, error } = useFetch(getPublicBlogs);
  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      <BlogList data={data} setData={setData} loading={loading} />
  );
}

export default Home;
