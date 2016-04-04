import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SearchPage from './searchPage.js';

injectTapEventPlugin();

ReactDOM.render(
    React.createElement(SearchPage),

  document.getElementById('root')
);
