import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import TuitionFeePage from '../components/TuitionFee';

const TuitionFees = () => (
  <>
    <Routes>
      <Route exact path="/tuition-fees" element={<TuitionFeePage />} />
    </Routes>

    <Outlet />
  </>
);
export default TuitionFees;
