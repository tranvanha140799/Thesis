import React from "react";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

const EditBtn = ({ onEdit }) => (
  <Button type="primary" shape="round" onClick={onEdit} icon={<EditOutlined />}>
    Sửa
  </Button>
);

export default EditBtn;
