import { Button } from "antd";
import React from "react";

const EditBtn = ({ edit }) => {
  return (
    <Button type="primary" shape="round" onClick={edit}>
      Sửa
    </Button>
  );
};

export default EditBtn;
