import React from 'react';
import { useParams } from 'react-router-dom';
import AddCourse from './add';

const EditCourse = () => {
  const { courseId } = useParams();

  return <AddCourse id={courseId} />;
};

export default EditCourse;
