import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Divider, Flex, List, Space, Typography } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDateString } from '../../utils/dateUtil';
import styles from './BlogList.module.css';

const { Paragraph } = Typography;

function ListItem({ item, showActions, onDelete }) {
  const navigate = useNavigate();

  let previewText = item.previewText;
  if (previewText && (previewText.slice(-1) !== '.')) {
    previewText += ' ...';
  }
  const createdAt = getDateString(item.createdAt);

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
      <Flex justify="space-between" className={styles.listItemFooter}>
        <Space size="middle">
          <Action text={createdAt} />
          {/*<Action icon={LikeOutlined} text={item.likes} />*/}
          {/*<Action icon={MessageOutlined} text={item.comments} />*/}
        </Space>
        {showActions && <Space split={<Divider type="vertical" />} size={4}>
          <Action
            className={styles.clickable}
            icon={EditOutlined}
            text="Edit"
            size={6}
            onClick={() => navigate(`/blogs/${item._id}/edit`)}
          />
          <Action
            className={styles.clickable}
            icon={DeleteOutlined}
            text="Delete"
            size={6}
            onClick={() => onDelete(item._id)}
          />
        </Space>}
      </Flex>
    </List.Item>
  );
}

function Action({ icon, text, size, className, onClick }) {
  return (
    <Space size={size} className={className} onClick={onClick}>
      {icon && React.createElement(icon)}
      {text}
    </Space>
  );
}

function BlogList({ data, loading, showActions = false, onDelete }) {
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
        renderItem={(item) => <ListItem item={item} showActions={showActions} onDelete={onDelete} />}
      />
    </>
  );
}

export default BlogList;
