import React from 'react';
import { useParams } from 'react-router-dom';
import AddStudent from './add';

const EditStudent = () => {
  const { studentId } = useParams();
  return <AddStudent id={studentId} />;
};

export default EditStudent;
