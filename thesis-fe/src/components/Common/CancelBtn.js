import React from 'react';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const CancelBtn = ({ onCancel }) => (
  <Button
    type="primary"
    shape="round"
    danger
    icon={<CloseOutlined />}
    onClick={onCancel}
  >
    Huỷ
  </Button>
);

export default CancelBtn;
