import React from 'react';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const DeleteBtn = ({ onDelete }) => (
  <Button
    type="primary"
    danger
    shape="round"
    onClick={onDelete}
    icon={<DeleteOutlined />}
  >
    Xoá
  </Button>
);

export default DeleteBtn;
