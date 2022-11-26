import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import HomePage from '../components/Home';

const Home = () => (
  <>
    <Routes>
      <Route exact path="/" element={<HomePage />} />
    </Routes>

    <Outlet />
  </>
);
export default Home;
