import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Divider, Flex, List, Space, Typography } from 'antd';
import React from 'react';
import route from '../../route';
import { getDateString } from '../../utils/dateUtil';
import { openInNewTab } from '../../utils/navigateUtil';
import styles from './BlogList.module.css';

const { Paragraph } = Typography;

function ListItem({ data }) {
  let previewText = data.previewText;
  if (previewText && (previewText.slice(-1) !== '.')) {
    previewText += ' ...';
  }
  const createdAt = getDateString(data.createdAt);

  return (
    <List.Item>
      <List.Item.Meta
        title={<a className={styles.listItemTitle}>{data.title || 'Untitled'}</a>}
      />
      {previewText && <Paragraph className={styles.listItemContent}>{previewText}</Paragraph>}
      <Flex justify="space-between" className={styles.listItemFooter}>
        <Space size="middle">
          <ListFooterItem text={createdAt} />
          {/*<ListFooterItem icon={LikeOutlined} text={data.likes} />*/}
          {/*<ListFooterItem icon={MessageOutlined} text={data.comments} />*/}
        </Space>
        <Space split={<Divider type="vertical" />} size={4}>
          <ListFooterItem
            className={styles.clickable}
            icon={EditOutlined}
            text="Edit"
            size={6}
            onClick={() => {
              openInNewTab(`${route.edit}/${data._id}`);
            }}
          />
          <ListFooterItem className={styles.clickable} icon={DeleteOutlined} text="Delete" size={6} />
        </Space>
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

function BlogList({ data, loading }) {
  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        position: 'bottom',
        align: 'center'
      }}
      loading={loading}
      dataSource={loading ? [] : data}
      renderItem={(data) => <ListItem data={data} />}
    />
  );
}

export default BlogList;
