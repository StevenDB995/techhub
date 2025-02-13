import BlogList from '../../components/BlogList';
import Error from '../../components/Error';
import useFetch from '../../hooks/useFetch';

function HomePage() {
  const { data, loading, error } = useFetch('/blogs');
  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      <BlogList data={data} loading={loading} />
  );
}

export default HomePage;
