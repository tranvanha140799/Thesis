import React from 'react';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const DeleteBtn = ({ deletE }) => (
  <Button
    type="primary"
    danger
    shape="round"
    onClick={deletE}
    icon={<DeleteOutlined />}
  >
    Xoá
  </Button>
);

export default DeleteBtn;
