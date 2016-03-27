// main.js
var React = require('react');
var ReactDOM = require('react-dom');

var currentUrl = document.location.href

var url = new URL(currentUrl);
var params = new URLSearchParams(url.search.slice(1));
var searchStr= params.get("search");
params.set('baz', 3);
var results = "No results for now";

function updateSearchResults(value)
{
    results = value;
}

ReactDOM.render(
  <h1>Searching for: {searchStr}: Results:{results}</h1>,
  document.getElementById('root')
);