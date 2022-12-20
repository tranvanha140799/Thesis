import { Card, Tabs } from 'antd';
import TabPane from 'antd/lib/tabs/TabPane';
import React from 'react';
import { useParams } from 'react-router-dom';
import AddCourse from './add';
import Info from './info';

const EditCourse = () => {
  const { courseId } = useParams();

  return (
    <Tabs defaultActiveKey="1" style={{ width: '100%' }}>
      <TabPane tab="Thông Tin Khoá Học" key="1">
        <AddCourse id={courseId} />
      </TabPane>
      <TabPane tab="Danh Sách Lớp Học" key="2">
        <Card hoverable={false}>
          <Info id={courseId} />
        </Card>
      </TabPane>
    </Tabs>
  );
};

export default EditCourse;
