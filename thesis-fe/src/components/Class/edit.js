import React from "react";
import { useParams } from "react-router-dom";
import AddStudent from "./add";

const EditCLass = () => {
  const { classId } = useParams();
  return <AddStudent id={classId} />;
};

export default EditCLass;
