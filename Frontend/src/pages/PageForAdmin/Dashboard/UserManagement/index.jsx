import React, { useState, useRef } from 'react';
import { Card, Tabs } from 'antd';
import UserList from './UserList';
import UserDetail from './UserDetail';

const { TabPane } = Tabs;

const UserManagement = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [activeTabKey, setActiveTabKey] = useState("list");
  const userListRef = useRef(null);

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
    setActiveTabKey("detail");
  };

  const handleUpdateUserList = () => {
    if (userListRef.current) {
      userListRef.current.fetchAccounts();
    }
  };

  const handleBackToList = () => {
    setActiveTabKey("list");
    setSelectedUserId(null);
  };

  return (
    <Card title="Quản lý người dùng">
      <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
        <TabPane tab="Danh sách người dùng" key="list">
          <UserList onSelectUser={handleSelectUser} ref={userListRef} />
        </TabPane>
        <TabPane tab="Chi tiết người dùng" key="detail" disabled={!selectedUserId}>
          {selectedUserId && <UserDetail userId={selectedUserId} onClose={() => setSelectedUserId(null)} onUpdateUserList={handleUpdateUserList} onBackToList={handleBackToList} />}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default UserManagement; 