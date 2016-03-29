import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Connector from './connector.js';
import SearchResultItem from './SearchResultItem';
import TextField from 'material-ui/lib/text-field';

export default class DialogExampleSimple extends React.Component
{
    constructor(props)
    {
        super(props);


        var that = this;

        this.connector = new Connector();
        this.connector.registerEvent("updateSearchResults", function(results) {
            that.updateSearchResults(results);
        });

        this.results = [];
        this.onItemClicked = this.onItemClicked.bind(this);
        this.onSearchTextChanged = this.onSearchTextChanged.bind(this);
        this.updateSearchResults = this.updateSearchResults.bind(this);

        //set search from url
        var currentUrl = new URL(document.location.href);
        var params = new URLSearchParams(currentUrl.search.slice(1));
        var searchText= params.get("search");
        this.connector.sendMessage("searchRequest", searchText);

        this.state = {
            results: [],
            defaultSearch:searchText
        };
    }


    updateSearchResults(results)
    {
        this.setState({results: results});
    }

    onItemClicked()
    {
      console.log("!open");
      this.setState({open: true});
    }

    onSearchTextChanged(event)
    {
      var search = event.target.value;
      this.connector.sendMessage("searchRequest", search);
    }

    render() {

      return (
        <div>
           <TextField
              hintText="Your wishes... my desires"
              defaultValue = {this.state.defaultSearch}
              onChange={this.onSearchTextChanged}
          /><br/>
         <ol>
            {this.state.results.map(function(result) {
                return <li key={result.id}>{result.content}</li>;
            })}
          </ol>
        </div>
      );
    }
}