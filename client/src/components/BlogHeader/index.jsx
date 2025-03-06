import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Flex, Typography } from 'antd';
import { Link } from 'react-router-dom';
import BlogActions from '../BlogActions';
import styles from './BlogHeader.module.css';

const { Title } = Typography;

function BlogHeader({ blog, editable, onDelete }) {
  const authorPage = `/${blog.author.username}/blogs`;

  return (
    <div>
      <Title level={2}>{blog.title}</Title>
      <Flex align="center" gap="small" className={styles.author}>
        <Link to={authorPage}>
          <Avatar src={blog.author.avatar} icon={<UserOutlined />} />
        </Link>
        <Button variant="link" color="default" className={styles.username}>
          <Link to={authorPage}>
            {blog.author.username}
          </Link>
        </Button>

      </Flex>
      <BlogActions blog={blog} editable={editable} onDelete={onDelete} />
    </div>
  );
}

export default BlogHeader;
