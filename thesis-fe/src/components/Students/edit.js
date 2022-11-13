import { Card, Col, Row, Tabs } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import AddStudent from './add';
import Info from './info';

const { TabPane } = Tabs;

const EditStudent = () => {
  const { studentId } = useParams();

  return (
    <Tabs defaultActiveKey="1" style={{ width: '100%' }}>
      <TabPane tab="Thông Tin Cá Nhân" key="1">
        <Card hoverable={false}>
          <AddStudent id={studentId} />
        </Card>
      </TabPane>
      <TabPane tab="Thông Tin Lớp Học & Học Phí" key="2">
        <Card hoverable={false}>
          <Info id={studentId} />
        </Card>
      </TabPane>
    </Tabs>
  );
};

export default EditStudent;
