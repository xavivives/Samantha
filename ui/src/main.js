// main.js
import React from 'react';
import ReactDOM from 'react-dom';
import Connector from './connector.js';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import searchResultsList from './searchResultsList.js';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

var currentUrl = document.location.href

var url = new URL(currentUrl);
var params = new URLSearchParams(url.search.slice(1));
var searchStr= params.get("search");
var results = []; 

Connector.registerEvent("updateSearchResults", updateSearchResults);

Connector.sendMessage("searchRequest", searchStr);

Connector._processMessage = function (message)
{
    var event = message.event; 
    var value = message.value;
    if(event == "updateSearchResults")
        updateSearchResults(value);
}
 
function updateSearchResults(results)
{
    console.log("HHEERERHRH");
    console.log(results);

    ReactDOM.render(
        React.createElement(searchResultsList,{results: results}),
        document.getElementById('root')
    );

}
//<h1>Searching for: {searchStr}: Results:{results}</h1>
ReactDOM.render(
    React.createElement(searchResultsList,{results: results}),

  document.getElementById('root')
);

/*
 * In this file, we create a React component
 * which incorporates components providedby material-ui.
 */

/*
import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import Dialog from 'material-ui/lib/dialog';
import {deepOrange500} from 'material-ui/lib/styles/colors';
import FlatButton from 'material-ui/lib/flat-button';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider';

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);

    this.state = {
      open: false,
    };
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  handleTouchTap() {
    this.setState({
      open: true,
    });
  }

  render() {
    const standardActions = (
      <FlatButton
        label="Okey"
        secondary={true}
        onTouchTap={this.handleRequestClose}
      />
    );

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <Dialog
            open={this.state.open}
            title="Super Secret Password"
            actions={standardActions}
            onRequestClose={this.handleRequestClose}
          >
            1-2-3-4-5
          </Dialog>
          <h1>material-ui</h1>
          <h2>example project</h2>
          <RaisedButton
            label="Super Secret Password"
            primary={true}
            onTouchTap={this.handleTouchTap}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;*/