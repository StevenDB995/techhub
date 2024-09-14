import { DeleteOutlined, EditOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { Divider, Flex, List, Space, Typography } from 'antd';
import React from 'react';
import styles from './Home.module.css';

const data = [
  {
    title: 'How to host a Minecraft server yourself',
    previewText: 'Hello hello hello hello...',
    createdAt: '09/09/2021',
    likes: 156,
    comments: 2
  },
  {
    title: 'Common Linux Commands',
    previewText: 'Hello common Linux command line...',
    createdAt: '09/09/2021',
    likes: 88,
    comments: 4
  },
  {
    title: 'Cloudflare Web Service Introduction',
    previewText: 'Hello hello hello hello...',
    createdAt: '09/09/2021',
    likes: 6,
    comments: 0
  }
];

const { Paragraph } = Typography;

function ListFooterItem({ icon, text, size, className }) {
  return (
    <Space size={size} className={className}>
      {icon && React.createElement(icon)}
      {text}
    </Space>
  );
}

function Home() {
  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        position: 'bottom',
        align: 'center'
      }}
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item
          key={index}
        >
          <List.Item.Meta
            title={<a className={styles.listItemTitle}>{item.title}</a>}
          />
          <Paragraph className={styles.listItemContent}>{item.previewText}</Paragraph>
          <Flex justify="space-between" className={styles.listItemFooter}>
            <Space size="middle">
              <ListFooterItem text={item.createdAt} />
              <ListFooterItem icon={LikeOutlined} text={item.likes} />
              <ListFooterItem icon={MessageOutlined} text={item.comments} />
            </Space>
            <Space split={<Divider type="vertical" />} size={4}>
              <ListFooterItem className={styles.clickable} icon={EditOutlined} text="Edit" size={6} split />
              <ListFooterItem className={styles.clickable} icon={DeleteOutlined} text="Delete" size={6} />
            </Space>
          </Flex>
        </List.Item>
      )}
    />
  );
}

export default Home;
