// main.js
var React = require('react');
var ReactDOM = require('react-dom');
var Connector = require ('./connector.js');

var currentUrl = document.location.href

var url = new URL(currentUrl);
var params = new URLSearchParams(url.search.slice(1));
var searchStr= params.get("search");
var results = "No results for now";

console.log("app");
console.log(Connector);

//Connector.sendMessage("onSearchRequested", searchStr);


Connector.processMessage = function (event, value)
{
    if(event == "updateSearchResults")
        updateSearchResults(value);
}

function updateSearchResults(value)
{
    results = value;
}

ReactDOM.render(
  <h1>Searching for: {searchStr}: Results:{results}</h1>,
  document.getElementById('root')
);
