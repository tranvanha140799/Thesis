import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import ClassPage from '../components/Class';
import AddClass from '../components/Class/add';
import EditCLass from '../components/Class/edit';

const Classes = () => (
  <>
    <Routes>
      <Route exact path="/classes" element={<ClassPage />} />
      <Route exact path="/classes/add" element={<AddClass />} />
      <Route exact path="classes/:classId" element={<EditCLass />} />
    </Routes>

    <Outlet />
  </>
);
export default Classes;
