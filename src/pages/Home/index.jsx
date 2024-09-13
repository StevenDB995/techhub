import { LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { List, Space } from 'antd';
import PropTypes from 'prop-types';
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

Action.propTypes = {
  icon: PropTypes.object,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

function Action({ icon, text }) {
  return (
    <Space>
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
          actions={[
            <Action text={item.createdAt} key="createdAt" />,
            <Action icon={LikeOutlined} text={item.likes} key="like" />,
            <Action icon={MessageOutlined} text={item.comments} key="comment" />
          ]}
        >
          <List.Item.Meta
            title={<span className={styles.listTitle}>{item.title}</span>}
            description={<span className={styles.listDescription}>{item.previewText}</span>}
          />
        </List.Item>
      )}
    />
  );
}

export default Home;
