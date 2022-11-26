<<<<<<< HEAD
import { Button } from "antd";
import React from "react";

const EditBtn = ({ edit }) => {
  return (
    <Button type="primary" shape="round" onClick={edit}>
      Sửa
    </Button>
  );
};
=======
import React from 'react';
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const EditBtn = ({ onEdit }) => (
  <Button type="primary" shape="round" onClick={onEdit} icon={<EditOutlined />}>
    Sửa
  </Button>
);
>>>>>>> 815f0a9907a42977bb657ab1a708be48bf7fc075

export default EditBtn;
