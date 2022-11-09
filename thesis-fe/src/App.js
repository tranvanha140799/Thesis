// import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';

import Home from './Routing Components';
import Auth from './components/Auth/Auth';
import { authActions } from './redux/authSlice';

import './App.css';
import 'antd/dist/antd.css';

const { isSignedIn } = authActions;

function App() {
  const dispatch = useDispatch();

  dispatch(isSignedIn());
  const user = useSelector((state) => state.authReducer.authData);

  // useEffect(() => {
  //   dispatch(isSignedIn());
  // }, [user]);

  return (
    <Routes>
      <Route path="*" exact element={!user ? <Navigate to="/auth" /> : <Home />} />
      <Route path="/auth" exact element={!user ? <Auth /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;
