import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';

import SearchResultItem from './SearchResultItem';

export default class DialogExampleSimple extends React.Component
{

  constructor(props)
  {

    super(props);
    this.state = {
      //results: [{content},"b","c","d"]
    };
    this.results = [];
    this.onClicked = this.onClicked.bind(this);
  }

  onClicked()
  {
    console.log("!open");
    this.setState({open: true});
  }

  render() {

    return (
      <div>
        <RaisedButton label="Dialog" onTouchTap={this.onClicked} />
       <ol>
        {this.props.results.map(function(result) {
              return <li key={result.id}>{result.content}</li>;
            })}
        </ol>
      </div>
    );
  }
}