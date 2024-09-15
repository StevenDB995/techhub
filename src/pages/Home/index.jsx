import { DeleteOutlined, EditOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { Divider, Flex, List, Space, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import route from '../../route';
import styles from './Home.module.css';

const data = [
  {
    id: 'aaa',
    title: 'How to host a Minecraft server yourself',
    previewText: 'We want to help find the job that’s right for you – and these roles could be a match. ' +
      'We recommend these jobs based on your profile, past viewed jobs and applications.',
    createdAt: '09/09/2021',
    likes: 156,
    comments: 2
  },
  {
    id: 'bbb',
    title: 'Common Linux Commands',
    previewText: 'We want to help find the job that’s right for you – and these roles could be a match. ' +
      'We recommend these jobs based on your profile, past viewed jobs and applications.',
    createdAt: '09/09/2021',
    likes: 88,
    comments: 4
  },
  {
    id: 'ccc',
    title: 'Cloudflare Web Service Introduction',
    previewText: 'We want to help find the job that’s right for you – and these roles could be a match. ' +
      'We recommend these jobs based on your profile, past viewed jobs and applications.',
    createdAt: '09/09/2021',
    likes: 6,
    comments: 0
  }
];

const { Paragraph } = Typography;

function ListFooterItem({ icon, text, size, className, onClick }) {
  return (
    <Space size={size} className={className} onClick={onClick}>
      {icon && React.createElement(icon)}
      {text}
    </Space>
  );
}

function Home() {
  const navigate = useNavigate();

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
              <ListFooterItem
                className={styles.clickable}
                icon={EditOutlined}
                text="Edit"
                size={6}
                onClick={() => {
                  navigate(route.edit.split(':')[0] + item.id);
                }}
              />
              <ListFooterItem className={styles.clickable} icon={DeleteOutlined} text="Delete" size={6} />
            </Space>
          </Flex>
        </List.Item>
      )}
    />
  );
}

export default Home;
