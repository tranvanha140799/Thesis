import React from "react";
import { useParams } from "react-router-dom";
import AddStudent from "./add";

const EditCourse = () => {
  const { courseId } = useParams();
  return <AddStudent id={courseId} />;
};

export default EditCourse;
