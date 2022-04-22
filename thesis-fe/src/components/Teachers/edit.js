import React from 'react';
import { useParams } from 'react-router-dom';
import AddTeacher from './add';

const EditTeacher = () => {
  const { teacherId } = useParams();
  return <AddTeacher id={teacherId} />;
};

export default EditTeacher;
