import React from 'react';
import { useParams } from 'react-router-dom';
import AddSalary from './add';

const EditSalary = () => {
  const { salaryRankId } = useParams();
  return <AddSalary id={salaryRankId} />;
};

export default EditSalary;
