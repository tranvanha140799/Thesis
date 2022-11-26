import { Button, Col, Row } from 'antd';
import React from 'react';
import { PlusOutlined } from '@ant-design/icons';

const AddBtn = ({ add }) => (
  <Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <Col>
      <Button
        type="primary"
        shape="round"
        onClick={add}
        icon={<PlusOutlined />}
        style={{ marginBottom: '5px' }}
      >
        Thêm
      </Button>
    </Col>
  </Row>
);

export default AddBtn;
