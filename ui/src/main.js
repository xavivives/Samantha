// main.js
var React = require('react');
var ReactDOM = require('react-dom');
var Connector = require ('./connector.js');

var currentUrl = document.location.href

var url = new URL(currentUrl);
var params = new URLSearchParams(url.search.slice(1));
var searchStr= params.get("search");
var results = "No results for now"; 

Connector.sendMessage("searchRequest", searchStr);

Connector.processMessage = function (message)
{
    console.log(message);
    console.log(message.value);
    var event = message.event;
    var value = message.value;
    if(event == "updateSearchResults")
        updateSearchResults(value);
}

function updateSearchResults(results)
{
    console.log(results);
    ReactDOM.render(
      <h1>Searching for: {searchStr}: Results:{results}</h1>,
      document.getElementById('root')
    );
}


ReactDOM.render(
  <h1>Searching for: {searchStr}: Results:{results}</h1>,
  document.getElementById('root')
);
