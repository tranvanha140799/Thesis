import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';
import reportWebVitals from './reportWebVitals';

import store from './redux';
import './index.css';

ReactDOM.render(
  <React.Fragment>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.Fragment>,
  document.getElementById('root')
);

reportWebVitals();
