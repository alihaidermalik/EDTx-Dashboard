import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import './index.css';
import Root from './Root';
import registerServiceWorker from './registerServiceWorker';

import { store } from './helpers';

ReactDOM.render(
    <Provider store={store}>
        <Root />
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
