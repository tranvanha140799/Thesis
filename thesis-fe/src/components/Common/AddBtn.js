import { Button } from "antd";
import React from "react";

const AddBtn = ({ add }) => {
  return (
    <Button type="primary" shape="round" onClick={add}>
      Add
    </Button>
  );
};

export default AddBtn;
