import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { App as AntdApp, Divider, Flex, List, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import { getDateString } from '../../utils/dateUtil';
import styles from './BlogList.module.css';

const { Paragraph } = Typography;

function ListItem({ item, isPublic, onDelete }) {
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
            to={`${isPublic ? '/blogs' : '/my-blogs'}/${item._id}`}
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
          <ListFooterItem text={createdAt} />
          {/*<ListFooterItem icon={LikeOutlined} text={data.likes} />*/}
          {/*<ListFooterItem icon={MessageOutlined} text={data.comments} />*/}
        </Space>
        {!isPublic && <Space split={<Divider type="vertical" />} size={4}>
          <ListFooterItem
            className={styles.clickable}
            icon={EditOutlined}
            text="Edit"
            size={6}
            onClick={() => {
              navigate(`/my-blogs/${item._id}/edit`);
            }}
          />
          <ListFooterItem
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

function ListFooterItem({ icon, text, size, className, onClick }) {
  return (
    <Space size={size} className={className} onClick={onClick}>
      {icon && React.createElement(icon)}
      {text}
    </Space>
  );
}

function BlogList({ data, loading, isPublic = true }) {
  const api = useApi();
  const [blogs, setBlogs] = useState([]);
  const { modal: antdModal } = AntdApp.useApp();

  useEffect(() => {
    if (data) setBlogs(data);
  }, [data]);

  const confirmDelete = (blogId) => {
    antdModal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure?',
      okText: 'Delete',
      okButtonProps: {
        danger: true
      },
      autoFocusButton: null,
      onOk: () => handleBlogDelete(blogId)
    });
  };

  const feedbackDelete = (success, errorMessage) => {
    if (success) {
      antdModal.success({
        title: 'Success',
        content: 'Blog deleted',
        cancelButtonProps: { style: { display: 'none' } }
      });
    } else {
      antdModal.error({
        title: 'Error',
        content: errorMessage || 'Error deleting blog',
        cancelButtonProps: { style: { display: 'none' } }
      });
    }
  };

  const handleBlogDelete = async (blogId) => {
    try {
      await api.delete(`/blogs/${blogId}`);
      feedbackDelete(true);
      setBlogs(blogs.filter(blog => blog._id !== blogId));
    } catch (err) {
      feedbackDelete(false, err.message);
    }
  };

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
        dataSource={blogs}
        renderItem={(item) => <ListItem item={item} isPublic={isPublic} onDelete={confirmDelete} />}
      />
    </>
  );
}

export default BlogList;
