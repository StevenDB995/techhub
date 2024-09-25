import BlogList from '../../components/BlogList';
import Error from '../../components/Error';
import useFetch from '../../hooks/useFetch';

function MyDrafts() {
  const { data, setData, loading, error } = useFetch('/blogs', { params: { status: 'draft' } });
  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      <BlogList data={data} setData={setData} loading={loading} />
  );
}

export default MyDrafts;
