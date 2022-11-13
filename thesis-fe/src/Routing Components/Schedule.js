import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import SchedulePage from '../components/Schedule';

const Classes = () => (
  <>
    <Routes>
      <Route exact path="/schedules" element={<SchedulePage />} />
    </Routes>

    <Outlet />
  </>
);
export default Classes;
