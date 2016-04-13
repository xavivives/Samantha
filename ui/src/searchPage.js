import React from 'react';
import Connector from './connector.js';
import SearchResultItem from './searchResultItem';
import TextField from 'material-ui/lib/text-field';
import GetMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import theme from './theme.js';
import LazyLoad from 'react-lazy-load';

export default class SearchPage extends React.Component
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
        this.onSearchTextChanged = this.onSearchTextChanged.bind(this);
        this.updateSearchResults = this.updateSearchResults.bind(this);
       // this.getChildContext = this.getChildContext.bind(this);

        //set search from url parameter
        var currentUrl = new URL(document.location.href);
        var params = new URLSearchParams(currentUrl.search.slice(1));
        var searchText= params.get("search");
        this.connector.sendMessage("searchRequest", searchText);

        this.state = {
            results: [],
            defaultSearch:searchText,
            baseUrl: currentUrl
        };
    }

    getChildContext()
    {
        return { muiTheme: GetMuiTheme(theme)};
    }

    updateUrl(searchText)
    {
        /*var currentUrl = new URL(document.location.href);
        var params = new URLSearchParams(currentUrl.search.slice(1));
        var searchText= params.set("search",searchText);
        history.pushState({}, "Looking for "+searchText, currentUrl);
        */
    }

    updateSearchResults(results)
    {
        this.setState({results: results});
    }

    onSearchTextChanged(event)
    {
      var search = event.target.value;
      this.connector.sendMessage("searchRequest", search);
      //updateUrl(search);
    }

    render() {

      return (
       
             <div style ={{display: 'flex', justifyContent: 'center'}}>

                <LazyLoad height={200} offset={300}>
                    <img  src="http://cdn3-www.comingsoon.net/assets/uploads/1970/01/file_586311_scarlett-johansson-her-rome-feat.jpg" />
                </LazyLoad>

                <div style ={{width:450}}>
                    <div style ={{display: 'flex', justifyContent: 'center'}}>
                       <TextField
                            hintText="Your wishes... my desires"
                            defaultValue = {this.state.defaultSearch}
                            onChange={this.onSearchTextChanged}/>
                    </div>
                    <br/>
                    <div>
                        {this.state.results.map(function(result){
                            return <SearchResultItem result={result} key={result.id}/>
                        })}
                    </div>
                </div>
            </div>
      );
    }
}

SearchPage.childContextTypes = {
        muiTheme: React.PropTypes.object
    }