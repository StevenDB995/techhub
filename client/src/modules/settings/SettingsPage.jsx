import useAuth from '@/hooks/useAuth';
import AccountSettings from '@/modules/settings/components/AccountSettings';
import ProfileSettings from '@/modules/settings/components/ProfileSettings';
import { SecurityScanOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Col, ConfigProvider, Menu, Row, Typography } from 'antd';
import { useState } from 'react';
import styles from './SettingsPage.module.css';

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

function SettingsPanel({ currentTab, user, reloadUser }) {
  let content;
  if (currentTab === 'account') {
    content = <AccountSettings user={user} />;
  } else {
    content = <ProfileSettings user={user} reloadUser={reloadUser} />;
  }

  return (
    <div className={styles.settingsPanel}>
      <Title level={4}>{titleMap[currentTab]}</Title>
      {content}
    </div>
  );
}

function SettingsPage() {
  const { user, reloadUser } = useAuth();
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
          <SettingsPanel currentTab={currentTab} user={user} reloadUser={reloadUser} />
        </Col>
      </Row>
    </>
  );
}

export default SettingsPage;
