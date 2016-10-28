import React from 'react';
import Connector from './../connector.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'; 
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import HitagUtils from './hitagUtils.js';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

export default class HelpContent extends React.Component
{
    static get defaultProps()
    {
        var props = 
        {
           initiallyOpen:false
        }

        return props;
    }

    constructor(props)
    {
        super(props);
        this.onDialogClose = this.onDialogClose.bind(this);

        this.state = { isOpen: false};

        if(props.initiallyOpen)
            this.state = { isOpen: true};

        this.pStyle={
            fontSize: "80%",
            marginTop: 5,
            marginBottom: 5
        }
        //<img src={'chrome-extension://kgepkchafobndnjkmnahfpkpkpjdncdg/logo_screenshot.png'} />

        this.content =
            <div>
                <h5>Save bookmark</h5>
                <p style = {this.pStyle} >See the little orange icon on the top-right of your browser? Click it.</p>
                <p style = {this.pStyle} >Now your bookmark it's saved!</p>
                <h5>Organize it</h5>
                <p style = {this.pStyle}>You can categorize your content by adding tags</p>
                <p style = {this.pStyle}>Type your tag and hit enter</p>
                <h5>Organize it... better!</h5>
                <p style = {this.pStyle}>You can mimic a folder structure by using hierarchical tags. This only means 'tags inside other tags'</p>
                <p style = {this.pStyle}>To do so, type your tag and then double tap 'space'. Now you can type a new tag that will exist inside the previous one.</p>
                <h5>Access your bookmarks</h5>
                 <p style = {this.pStyle}>After saving your bookmarks you can access them in different ways:</p>
                <p style = {this.pStyle}> - Open a new tab. Use the search field there.</p>
                <p style = {this.pStyle}> - On the URL field type 's' + 'tab'. Now you can type you search and hit enter</p>
                <p style = {this.pStyle}> - Just use Google. If a relevant search is found it will show up on your Google results page.</p>
            </div>

        this.muiTheme = getMuiTheme({
        });
    }

    onDialogClose()
    {
        this.setState({isOpen:false});
    }

    openDialog()
    {
         this.setState({isOpen:true});
    }

    render()
    {
        const actions = [
              <FlatButton
                label="Got it!"
                primary={true}
                keyboardFocused={false}
                onTouchTap={this.onDialogClose}
              />,
            ];

        return(

           <MuiThemeProvider muiTheme={this.muiTheme}>

               <div>
               <Dialog
                 title="Samantha Help"
                 actions={actions}
                 modal={false}
                 open={this.state.isOpen}
                 onRequestClose={this.onDialogClose}>
                 {this.content}
               </Dialog>
             </div>
           </MuiThemeProvider>
        );
    }
}