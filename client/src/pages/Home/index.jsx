import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Divider, Flex, List, Space, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBlogs } from '../../api/services/Blog';
import Error from '../../components/Error';
import useFetch from '../../hooks/useFetch';
import route from '../../route';
import styles from './Home.module.css';

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
  const { data, loading, error } = useFetch(getAllBlogs);

  return (
    error ?
      <Error status={error.status} message={error.message} /> :
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          position: 'bottom',
          align: 'center'
        }}
        loading={loading}
        dataSource={loading ? [] : data}
        renderItem={(item, index) => {
          let previewText = item.previewText;
          if (previewText.slice(-1) !== '.') {
            previewText += ' ...';
          }
          return (
            <List.Item
              key={index}
            >
              <List.Item.Meta
                title={<a className={styles.listItemTitle}>{item.title}</a>}
              />
              <Paragraph className={styles.listItemContent}>{previewText}</Paragraph>
              <Flex justify="space-between" className={styles.listItemFooter}>
                <Space size="middle">
                  <ListFooterItem text={item.createdAt} />
                  {/*<ListFooterItem icon={LikeOutlined} text={item.likes} />*/}
                  {/*<ListFooterItem icon={MessageOutlined} text={item.comments} />*/}
                </Space>
                <Space split={<Divider type="vertical" />} size={4}>
                  <ListFooterItem
                    className={styles.clickable}
                    icon={EditOutlined}
                    text="Edit"
                    size={6}
                    onClick={() => {
                      navigate(`${route.edit}/${item.id}`);
                    }}
                  />
                  <ListFooterItem className={styles.clickable} icon={DeleteOutlined} text="Delete" size={6} />
                </Space>
              </Flex>
            </List.Item>
          );
        }}
      />
  );
}

export default Home;
