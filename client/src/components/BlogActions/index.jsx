import { getDateString } from '@/utils/dateUtil';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Divider, Flex, Space } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BlogActions.module.css';

function Action({ icon, text, size, className, onClick }) {
  return (
    <Space size={size} className={className} onClick={onClick}>
      {icon && React.createElement(icon)}
      {text}
    </Space>
  );
}

function BlogActions({ blog, editable, onDelete }) {
  const navigate = useNavigate();

  return (
    <Flex justify="space-between" className={styles.blogActions}>
      <Space size="middle">
        <Action text={getDateString(blog.createdAt)} />
      </Space>
      {editable && <Space split={<Divider type="vertical" />} size={4}>
        <Action
          className={styles.clickable}
          icon={EditOutlined}
          text="Edit"
          size={6}
          onClick={() => navigate(`/blogs/${blog._id}/edit`)}
        />
        <Action
          className={styles.clickable}
          icon={DeleteOutlined}
          text="Delete"
          size={6}
          onClick={() => onDelete(blog._id)}
        />
      </Space>}
    </Flex>
  );
}

export default BlogActions;
