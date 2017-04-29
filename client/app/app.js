import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import './index.css';

import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducers from './reducers';

let store = createStore(
  reducers
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);