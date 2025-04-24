import AccountSettings from '@/components/settings/AccountSettings';
import ProfileSettings from '@/components/settings/ProfileSettings';
import useAuth from '@/hooks/useAuth';
import { SecurityScanOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Col, ConfigProvider, Menu, Row, Typography } from 'antd';
import { useState } from 'react';

const menuTheme = {
  components: {
    Menu: {
      itemBg: 'transparent',
      subMenuItemBg: 'transparent',
      activeBarBorderWidth: 0
    }
  }
};

const menuItems = [
  {
    key: 'settings',
    label: 'Settings',
    icon: <SettingOutlined />,
    children: [
      {
        key: 'profile',
        label: 'Profile',
        icon: <UserOutlined />
      },
      {
        key: 'account',
        label: 'Account',
        icon: <SecurityScanOutlined />
      }
    ]
  }
];

const titleMap = {
  'profile': 'Profile Settings',
  'account': 'Account Settings'
};

const { Title } = Typography;

function SettingsPanel({ currentTab, user }) {
  let content;
  if (currentTab === 'account') {
    content = <AccountSettings user={user} />;
  } else {
    content = <ProfileSettings user={user} />;
  }

  return (
    <div style={{ padding: '0 12px' }}>
      <Title level={4}>{titleMap[currentTab]}</Title>
      {content}
    </div>
  );
}

function SettingsPage() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('profile');

  return (
    <>
      <Row>
        <Col span={24} md={6}>
          <ConfigProvider theme={menuTheme}>
            <Menu
              mode="inline"
              items={menuItems}
              openKeys={['settings']}
              selectedKeys={[currentTab]}
              onClick={({ key }) => setCurrentTab(key)}
            />
          </ConfigProvider>
        </Col>
        <Col span={24} md={18}>
          <SettingsPanel currentTab={currentTab} user={user} />
        </Col>
      </Row>
    </>
  );
}

export default SettingsPage;
