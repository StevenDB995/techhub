import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Divider, Flex, List, Modal, Space, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
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
          <ListFooterItem text={createdAt} />
          {/*<ListFooterItem icon={LikeOutlined} text={data.likes} />*/}
          {/*<ListFooterItem icon={MessageOutlined} text={data.comments} />*/}
        </Space>
        {showActions && <Space split={<Divider type="vertical" />} size={4}>
          <ListFooterItem
            className={styles.clickable}
            icon={EditOutlined}
            text="Edit"
            size={6}
            onClick={() => {
              navigate(`/blogs/${item._id}/edit`);
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

function BlogList({ data, loading, showActions = false }) {
  const api = useApi();
  const [blogs, setBlogs] = useState([]);
  const [modal, modalContextHolder] = Modal.useModal();

  useEffect(() => {
    if (data) setBlogs(data);
  }, [data]);

  const feedbackDelete = useCallback((success, errorMessage = undefined) => {
    if (success) {
      modal.success({
        title: 'Success',
        content: 'Blog deleted',
        cancelButtonProps: { style: { display: 'none' } }
      });
    } else {
      modal.error({
        title: 'Error',
        content: errorMessage || 'Error deleting blog',
        cancelButtonProps: { style: { display: 'none' } }
      });
    }
  }, [modal]);

  const handleDelete = useCallback(async (blogId) => {
    try {
      await api.delete(`/blogs/${blogId}`);
      feedbackDelete(true);
      setBlogs(blogs.filter(blog => blog._id !== blogId));
      localStorage.removeItem(`edit-${blogId}`);
    } catch (err) {
      feedbackDelete(false, err.message);
    }
  }, [api, blogs, feedbackDelete]);

  const confirmDelete = useCallback((blogId) => {
    modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure?',
      okText: 'Delete',
      okButtonProps: {
        danger: true
      },
      autoFocusButton: null,
      onOk: () => handleDelete(blogId)
    });
  }, [modal, handleDelete]);

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
        renderItem={(item) => <ListItem item={item} showActions={showActions} onDelete={confirmDelete} />}
      />
      {modalContextHolder}
    </>
  );
}

export default BlogList;
