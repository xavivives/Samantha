import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import PopupPage from './ui/popupPage.js';

injectTapEventPlugin();

ReactDOM.render(
    React.createElement(PopupPage),

  document.getElementById('root')
);
