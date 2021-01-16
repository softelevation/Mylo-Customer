import React from 'react';
import Routes from './src/routes';

import createSagaMiddleware from 'redux-saga';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {logger} from 'redux-logger';
import rootreducer from './src/redux/reducer';
import rootSaga from './src/redux/saga';
const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootreducer, applyMiddleware(sagaMiddleware, logger));
sagaMiddleware.run(rootSaga);
const App = () => {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

export default App;
