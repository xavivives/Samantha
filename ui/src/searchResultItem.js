import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';

export default class searchResultItem extends React.Component
{
    constructor(props)
    {
      super(props);
      this.onClicked = this.onClicked.bind(this);
    }

    onClicked(result)
    {
      this.setState({open: true});
      this.gotoUrl(url);
    }

    gotoUrl(url)
    {
      window.location.href = result.url;
    }

    render() {
        return (
            <div>
                <p style = {{color: 'gray', margin:'0px'}}> 
                    {this.props.result.content}
                </p>
                <p onClick= {()=>this.onClicked(this.props.result)}
                    style = {{color: 'red'}}> 

                    <span style = {{color: 'green'}}>
                        <b>{Math.round(this.props.result.score*100)/100+ " "}</b>
                    </span>
                    <b>{this.props.result.url}</b>
                </p> 
            </div>
        );
    }
}