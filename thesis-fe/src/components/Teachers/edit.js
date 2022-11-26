import { Card, Tabs } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

import AddTeacher from './add';
import Info from './info';

const { TabPane } = Tabs;

const EditTeacher = () => {
  const { teacherId } = useParams();
  return (
    <Tabs defaultActiveKey="1" style={{ width: '100%' }}>
      <TabPane tab="Thông Tin Giảng Viên" key="1">
        <Card hoverable={false}>
          <AddTeacher id={teacherId} />
        </Card>
      </TabPane>
      <TabPane tab="Thông Tin Lớp Dạy & Lương" key="2">
        <Card hoverable={false}>
          <Info id={teacherId} />
        </Card>
      </TabPane>
    </Tabs>
  );
};

export default EditTeacher;
