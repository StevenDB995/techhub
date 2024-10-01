import { useParams } from 'react-router-dom';
import CherryViewer from '../../components/CherryViewer';
import Error from '../../components/Error';
import Loading from '../../components/Loading';
import useFetch from '../../hooks/useFetch';

function View() {
  const { blogId } = useParams();
  const { data: blog, loading, error } = useFetch(`/blogs/${blogId}`);

  if (loading) return <Loading />;

  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      <CherryViewer value={blog.content} />
  );
}

export default View;
