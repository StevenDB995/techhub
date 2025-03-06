import { Divider } from 'antd';
import { useParams } from 'react-router-dom';
import BlogHeader from '../../components/BlogHeader';
import CherryViewer from '../../components/CherryViewer';
import Error from '../../components/Error';
import Loading from '../../components/Loading';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';

function ViewBlogPage() {
  const { user } = useAuth();
  const { blogId } = useParams();
  const { data: blog, loading, error } = useFetch(`/blogs/${blogId}`);
  const isMe = (blog !== null && blog.author._id === user?._id);

  if (loading) return <Loading />;

  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      <>
        <BlogHeader blog={blog} editable={isMe} />
        <Divider style={{
          marginTop: 16,
          marginBottom: 0,
        }} />
        <CherryViewer value={blog.content} />
      </>
  );
}

export default ViewBlogPage;
