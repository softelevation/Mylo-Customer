import React, {useEffect} from 'react';
import Routes from './src/routes';

import createSagaMiddleware from 'redux-saga';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {logger} from 'redux-logger';
import rootreducer from './src/redux/reducer';
import rootSaga from './src/redux/saga';
import {
  configurePush,
  toastLocalNotification,
} from './src/utils/push-notification-service';
const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootreducer, applyMiddleware(sagaMiddleware, logger));
sagaMiddleware.run(rootSaga);
const App = () => {
  // useEffect(() => {
  //   configurePush();
  //   toastLocalNotification();
  // });
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

export default App;
