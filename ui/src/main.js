// main.js
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
//import Connector from './connector.js';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import SearchPage from './searchPage.js';
injectTapEventPlugin();

var currentUrl = document.location.href

var url = new URL(currentUrl);
var params = new URLSearchParams(url.search.slice(1));
var searchStr= params.get("search");


ReactDOM.render(
    React.createElement(SearchPage),

  document.getElementById('root')
);
