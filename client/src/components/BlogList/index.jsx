import BlogActions from '@/components/BlogActions';
import { List, Typography } from 'antd';
import { Link } from 'react-router-dom';
import styles from './BlogList.module.css';

const { Paragraph } = Typography;

function ListItem({ item, editable, onDelete }) {
  const getPreviewText = () => {
    const { abstract, previewText } = item;
    if (abstract) {
      return abstract;
    } else if (previewText) {
      return previewText.endsWith('.') ? previewText : `${previewText} ...`;
    } else {
      return null;
    }
  };

  return (
    <List.Item>
      <List.Item.Meta
        title={
          <Link
            to={`/blogs/${item._id}`}
            className={styles.listItemTitle}
          >
            {item.title || 'Untitled'}
          </Link>
        }
        description={item.author.username}
      />
      <Paragraph className={styles.listItemContent}>
        {getPreviewText()}
      </Paragraph>
      <BlogActions blog={item} editable={editable} onDelete={onDelete} />
    </List.Item>
  );
}

function BlogList({ data, loading, editable = false, onDelete }) {
  return (
    <>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          position: 'bottom',
          align: 'center'
        }}
        loading={loading}
        dataSource={data || []}
        renderItem={(item) => <ListItem item={item} editable={editable} onDelete={onDelete} />}
      />
    </>
  );
}

export default BlogList;
