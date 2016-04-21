import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SearchPage from './searchPage.js';

injectTapEventPlugin();

var props ={showSearchInput:true, defaultSearchText:null, width: 450}

ReactDOM.render(
    React.createElement(SearchPage, props),

  document.getElementById('root')
);
