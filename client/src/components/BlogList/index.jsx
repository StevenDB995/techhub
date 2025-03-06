import { List, Typography } from 'antd';
import { Link } from 'react-router-dom';
import BlogActions from '../BlogActions';
import styles from './BlogList.module.css';

const { Paragraph } = Typography;

function ListItem({ item, editable, onDelete }) {
  let previewText = item.previewText;
  if (previewText && (previewText.slice(-1) !== '.')) {
    previewText += ' ...';
  }

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
      {previewText && <Paragraph className={styles.listItemContent}>{previewText}</Paragraph>}
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
