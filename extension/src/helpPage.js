import React from 'react';
import Connector from './connector.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'; 
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import HitagUtils from './hitagUtils.js';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

export default class HelpPage extends React.Component
{
    constructor(props)
    {
        super(props);

        var that = this;
        this.connector = new Connector();
        this.onDialogClose = this.onDialogClose.bind(this);

         this.state = {
            dialogIsOpened:true
        };

        this.content =
        {
            saveTitle:"Save bookmark",
            saveContent1: "See this icon? Click it.",
            saveContent2: "Now your bookmark it's saved",

            tagTitle:"Organize it",
            tagContent1:"You can categorize your content by adding tags",
            tagContent2:"Type your tag and hit enter",

            hitagTitle:"Organize it... better!",
            hitagContent1:"You can mimic a folder structure by using hierarchical tags. This only means 'tags inside other tags'",
            hitagContent2:"To do so, type your tag and then double tab 'space'. Now you can type a new tag that will exist inside the previous one.",

            accessTitle:"Access your bookmarks",
            accesssContent:"You can access the bookmarks you saved in different ways",
            accessContent:"- Open a new tab. Use the search field there.",
            accessContent:"- On the URL field type 's' + 'tab'. Now you can type you search and hit enter",
            accessContent:"- Just use Google. If a relevant search is found it will show up on your Google results page."
        }

        this.muiTheme = getMuiTheme({
        });
    }

    onDialogClose()
    {
        this.setState({dialogIsOpened:false});
    }

    render()
    {
        const actions = [
              <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.onDialogClose}
              />,
              <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.onDialogClose}
              />,
            ];

        return(

           <MuiThemeProvider muiTheme={this.muiTheme}>

               <div>
               <Dialog
                 title="Dialog With Actions"
                 actions={actions}
                 modal={false}
                 open={this.state.dialogIsOpened}
                 onRequestClose={this.onDialogClose}>

                 The actions in this window were passed in as an array of React objects.
               </Dialog>
             </div>
           </MuiThemeProvider>
        );
    }
}