import React from "react";
import { Button } from "antd";

const DeleteBtn = ({ deletE }) => {
  return (
    <Button type="primary" danger shape="round" onClick={deletE}>
      Xóa
    </Button>
  );
};

export default DeleteBtn;
