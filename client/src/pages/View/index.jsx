import { useParams } from 'react-router-dom';
import CherryViewer from '../../components/CherryViewer';
import Error from '../../components/Error';
import useFetch from '../../hooks/useFetch';

function View() {
  const { blogId } = useParams();
  const { data: blog, loading, error } = useFetch(`/blogs/${blogId}`);

  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      <CherryViewer
        value={blog ? blog.content : ''}
        loading={loading}
      />
  );
}

export default View;
