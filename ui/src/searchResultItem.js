import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';

export default class searchResultItem extends React.Component
{

  constructor(props)
  {
    super(props);
    this.state = {
      open: true,
    };

    this.onClicked = this.onClicked.bind(this);
  }

  onClicked()
  {
    console.log("!open");
    this.setState({open: true});
  }


  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.onClicked}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.onClicked}
      />,
    ];

    return (
      <div>
        {actions}
      </div>
    );
  }
}